import { Router, Request, Response } from "express";
import Pet from "@/models/pets";

const petRoutes = Router();

// Endpoint: GET /api/pets
petRoutes.get("/pets", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extraer query parameters (con valores por defecto seguros para la paginación)
    // Ej: /api/pets?page=1&limit=8&status=EN_ADOPCION&type=Perro
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const status = req.query.status as string;
    const type = req.query.type as string; 

    // 2. Calcular el Offset (La cantidad de registros que la base de datos debe saltarse)
    const offset = (page - 1) * limit;

    // 3. Construir el objeto de filtros (where clause) dinámicamente
    const whereClause: any = {};

    if (status) {
      // Si el frontend envía ?status=ENCONTRADA, se agrega al filtro
      whereClause.status = status;
    }

    if (type) {
      // Si el frontend envía ?type=Perro, se agrega al filtro
      whereClause.animal_type = type;
    }

    // 4. Consultar a la base de datos
    const { count, rows } = await Pet.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']], // Las publicaciones más recientes primero
    });

    // 5. Calcular información útil para la UI del frontend
    const totalPages = Math.ceil(count / limit);

    // 6. Enviar la respuesta estructurada
    res.status(200).json({
      message: "Mascotas obtenidas exitosamente",
      data: rows,
      pagination: {
        totalItems: count,         // Total de mascotas que coinciden con los filtros (ej. 45)
        totalPages: totalPages,    // Total de páginas calculadas (ej. 6)
        currentPage: page,         // Página actual (ej. 1)
        itemsPerPage: limit,       // Límite usado por página (ej. 8)
        hasNextPage: page < totalPages, // Booleano: ¿Hay una página siguiente?
        hasPrevPage: page > 1           // Booleano: ¿Hay una página anterior?
      }
    });

  } catch (error) {
    console.error("Error al obtener las mascotas:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener las mascotas" });
  }
});

export default petRoutes;