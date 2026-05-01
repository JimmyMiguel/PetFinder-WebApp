import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import Pet from "@/models/pets";
import { deletePetPhotos } from "@/controllers/deletePetPhoto";


// Si tienes una función para borrar de Firebase/S3, impórtala aquí:
// import { deletePetPhotos } from "@/controllers/imagenPetsController"; 

const petRoutes = Router();

// Endpoint: DELETE /api/pets/:id
petRoutes.delete("/pets/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const petId = req.params.id as string;
    
    // 1. Obtener el ID del usuario desde el token JWT
    const { userId } = res.locals.JwtPayload;

    // 2. Buscar la mascota en la base de datos
    const pet = await Pet.findByPk(petId);

    if (!pet) {
      res.status(404).json({ error: "La mascota que intentas eliminar no existe." });
      return;
    }

    // 3. REGLA DE ORO: Autorización (¿Es el dueño?)
    if (pet.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para eliminar esta publicación. Solo el creador puede hacerlo." });
      return;
    }

    // 4. Limpieza de imágenes en la nube (Recomendado)
    // Si la mascota tiene fotos, deberías borrarlas de tu Storage para no gastar espacio/dinero.
     
    if (pet.photos && pet.photos.length > 0) {
      try {
        await deletePetPhotos(pet.photos);
      } catch (storageError) {
        console.error("Error al borrar las fotos del storage, pero continuando con el borrado en BD:", storageError);
      }
    }
     

    // 5. Eliminar el registro de la base de datos de Neon
    await pet.destroy();

    // 6. Responder con éxito
    res.status(200).json({
      message: "Publicación eliminada correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar la mascota:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar la mascota" });
  }
});

export default petRoutes;