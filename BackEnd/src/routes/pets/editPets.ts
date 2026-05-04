import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import Pet from "@/models/pets";

const petRoutes = Router();

// Endpoint: PUT /api/pets/:id
petRoutes.put(
  "/pets/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const petId = req.params.id as string;

      // 1. Obtener el ID del usuario que está haciendo la petición (del Token JWT)
      const { id: userId } = res.locals.JwtPayload;

      // 2. Buscar la mascota en la base de datos
      const pet = await Pet.findByPk(petId);

      if (!pet) {
        res
          .status(404)
          .json({ error: "La mascota que intentas editar no existe." });
        return;
      }

      // 3. REGLA DE ORO: Autorización (¿Es el dueño?)
      if (pet.userId !== userId) {
        res
          .status(403)
          .json({
            error:
              "No tienes permiso para editar esta publicación. Solo el creador puede hacerlo.",
          });
        return;
      }

      // 4. Extraer los datos a actualizar desde el body
      const {
        status,
        name,
        animal_type,
        description,
        event_date,
        location_text,
        lat,
        lng,
      } = req.body;

      // 5. Preparar el objeto de actualización
      // Usamos Partial<any> porque el usuario podría querer actualizar solo un campo (ej. solo el status)
      const updateData: any = {};

      if (status) updateData.status = status;
      if (name !== undefined) updateData.name = name; // Puede ser null si es callejero
      if (animal_type) updateData.animal_type = animal_type;
      if (description) updateData.description = description;
      if (event_date) updateData.event_date = event_date;
      if (location_text) updateData.location_text = location_text;

      // 6. Manejar la actualización de la ubicación si enviaron nuevas coordenadas
      if (lat && lng) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (
          isNaN(latNum) ||
          isNaN(lngNum) ||
          latNum < -90 ||
          latNum > 90 ||
          lngNum < -180 ||
          lngNum > 180
        ) {
          res
            .status(400)
            .json({
              error: "Las nuevas coordenadas geográficas son inválidas.",
            });
          return;
        }

        // Reconstruimos el objeto POINT para PostGIS
        updateData.location_geo = {
          type: "Point",
          coordinates: [lngNum, latNum],
        };
      }

      // 7. Ejecutar la actualización en la base de datos
      // Sequelize actualizará solo los campos que existan dentro de updateData
      await pet.update(updateData);

      // 8. Responder con éxito
      res.status(200).json({
        message: "Publicación actualizada correctamente",
        pet: pet, // Devuelve la mascota ya con los datos nuevos
      });
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
      res
        .status(500)
        .json({ error: "Error interno del servidor al actualizar la mascota" });
    }
  },
);

export default petRoutes;
