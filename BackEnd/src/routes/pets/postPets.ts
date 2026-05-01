import { Router, Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import { requireAuth } from "@/middleware/midToken";
import { uploadMultiplePetPhotos } from "@/controllers/imagenPetsController";
import Pet from "@/models/pets";

const petRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { files: 5 } });

// Endpoint: POST /api/pets
petRoutes.post("/pets",requireAuth,upload.array("photos", 5),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = res.locals.JwtPayload;

      const {
        status,
        name,
        animal_type,
        description,
        event_date,
        location_text,
        lng,
        lat,
      } = req.body;

      // 1. Validación de campos básicos
      if (
        !status ||
        !animal_type ||
        !description ||
        !event_date ||
        !location_text ||
        !lng ||
        !lat
      ) {
        res
          .status(400)
          .json({ error: "Faltan campos obligatorios para la publicación." });
        return;
      }

      // 2. VALIDACIÓN ESTRICTA PARA MAPBOX / POSTGIS
      const lngNum = parseFloat(lng);
      const latNum = parseFloat(lat);

      if (
        isNaN(lngNum) ||
        isNaN(latNum) ||
        lngNum < -180 ||
        lngNum > 180 ||
        latNum < -90 ||
        latNum > 90
      ) {
        res.status(400).json({ error: "Coordenadas geográficas inválidas." });
        return;
      }

      // 3. Validación de archivos
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res
          .status(400)
          .json({ error: "Debes subir al menos una foto de la mascota." });
        return;
      }

      // 4. Subida de imágenes
      const petId = crypto.randomUUID();
      const fileBuffers = files.map((file) => file.buffer);
      const photoUrls = await uploadMultiplePetPhotos(fileBuffers, petId);

      // 5. ESTRUCTURA GEOJSON (La condición vital de Mapbox y Sequelize/PostGIS)
      // ✅ CORRECCIÓN: Se vuelve a crear el objeto Point para la única columna
      const pointLocation = {
        type: "Point",
        coordinates: [lngNum, latNum], // Siempre longitud primero, luego latitud
      };

      try {
        // 6. Inserción en Base de Datos
        const newPet = await Pet.create({
          id: petId,
          userId,
          status,
          name: name || null,
          animal_type,
          description,
          event_date,
          location_text,
           location_geo: pointLocation,
          photos: photoUrls,
        });

        res.status(201).json({
          message: "Publicación creada exitosamente",
          pet: newPet,
        });
      } catch (dbError) {
         console.error("Error al guardar en la base de datos:", dbError);
         throw new Error("Error de base de datos");  
      }
    } catch (error) {
      console.error("Error general al crear la publicación:", error);
      res
        .status(500)
        .json({ error: "Error interno del servidor al crear la publicación" });
    }
  },
);

export default petRoutes;
