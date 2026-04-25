import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { requireAuth } from '@/middleware/midToken';
import { uploadMultiplePetPhotos } from '@/controllers/imagenPetsController';
import Pet from '@/models/pets'; 

const petRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { files: 5 } });

// Endpoint: POST /api/pets
petRoutes.post('/pets', requireAuth, upload.array('photos', 5), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = res.locals.JwtPayload;

    // 1. Adaptamos los nombres a los estándares de Mapbox (lng, lat)
    const {
      status,
      name,
      animal_type,
      description,
      event_date,
      location_text,
      lng, // Mapbox suele devolver el objeto LngLat, sacamos "lng"
      lat  // y sacamos "lat"
    } = req.body;

    // Validación de campos básicos
    if (!status || !animal_type || !description || !event_date || !location_text || !lng || !lat) {
      res.status(400).json({ error: 'Faltan campos obligatorios para la publicación.' });
      return;
    }

    // 2. VALIDACIÓN ESTRICTA PARA MAPBOX
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);

    // Mapbox explotará si le das coordenadas fuera de la realidad del planeta Tierra
    if (isNaN(lngNum) || isNaN(latNum) || lngNum < -180 || lngNum > 180 || latNum < -90 || latNum > 90) {
      res.status(400).json({ error: 'Coordenadas geográficas inválidas.' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Debes subir al menos una foto de la mascota.' });
      return;
    }

    const petId = crypto.randomUUID();
    const fileBuffers = files.map(file => file.buffer);
    const photoUrls = await uploadMultiplePetPhotos(fileBuffers, petId);

    // 3. ESTRUCTURA GEOJSON (La condición vital de Mapbox y Sequelize)
    // El formato TIENE que ser estricto: [Longitud, Latitud]
    const pointLocation = {
      type: 'Point',
      coordinates: [lngNum, latNum], 
    };

    const newPet = await Pet.create({
      id: petId,
      userId,
      status,
      name: name || null,
      animal_type,
      description,
      event_date,
      location_text,
      latitud_geo: pointLocation,  // Sequelize lo guardará correctamente
      longitud_geo: pointLocation, // Ambos reciben el mismo objeto Point
      photos: photoUrls,
    });

    res.status(201).json({
      message: 'Publicación creada exitosamente',
      pet: newPet
    });

  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la publicación' });
  }
});

export default petRoutes;