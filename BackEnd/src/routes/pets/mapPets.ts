import { Router, Request, Response } from "express";
import Pet from "@/models/pets";
 
 const petRoutes = Router();

// Endpoint: GET /api/pets/map-locations
petRoutes.get("/map-locations", async (req: Request, res: Response): Promise<void> => {
  try {
    // Solo queremos buscar las mascotas que estén marcadas como "ENCONTRADA"
    // (Puedes modificar esto si en el futuro el mapa debe mostrar también las de "EN_ADOPCION")
    const statusFilter = req.query.status as string || 'ENCONTRADA';

    // Realizamos la consulta optimizada
    const locations = await Pet.findAll({
      where: {
        status: statusFilter,
      },
      // ⚠️ LA CLAVE DEL RENDIMIENTO: Seleccionamos estrictamente lo necesario
      attributes: ['id', 'location_geo', 'animal_type'], // Agregué animal_type como sugerencia útil
    });

    // Enviar respuesta ultra ligera
    res.status(200).json({
      message: "Ubicaciones obtenidas exitosamente",
      data: locations,
    });

  } catch (error) {
    console.error("Error al obtener ubicaciones para el mapa:", error);
    res.status(500).json({ error: "Error interno del servidor al cargar el mapa" });
  }
});

export default petRoutes;