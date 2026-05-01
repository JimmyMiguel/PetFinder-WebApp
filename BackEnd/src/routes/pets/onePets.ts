import { Router, Request, Response } from "express";
import Pet from "@/models/pets";
import User from "@/models/users";

const petRoutes = Router();

// Endpoint: GET /api/pets/:id
petRoutes.get("/pets/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    // Aplicamos la aserción de tipo para que TypeScript esté feliz
    const id = req.params.id as string;

    const pet = await Pet.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner", 
          attributes: ["id", "name", "email", "phone"], // Evitamos enviar contraseñas
        },
      ],
    });

    if (!pet) {
      res.status(404).json({ error: "La mascota solicitada no fue encontrada." });
      return;
    }

    res.status(200).json({
      message: "Detalles de la mascota obtenidos exitosamente",
      data: pet,
    });

  } catch (error) {
    console.error("Error al obtener los detalles de la mascota:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener la mascota" });
  }
});

export default petRoutes;