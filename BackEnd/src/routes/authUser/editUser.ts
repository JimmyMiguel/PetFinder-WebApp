import { Router, Request, Response } from "express";
import multer from "multer";
import { requireAuth } from "@/middleware/midToken";
import { uploadAvatarToCloudinary } from "@/controllers/imagenPerfilController";

const editProfile = Router();

// Configuración de Multer (almacenamiento en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint: PUT /api/user/profile/:userId/avatar
editProfile.put(
  "/user/profile/:userId/avatar",
  requireAuth,
  upload.single("avatar"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;

      // TRAEMOS EL ID DEL TOKEN
      const { id: userId } = res.locals.JwtPayload;

      // VALIDACIÓN DE SEGURIDAD
      if (req.params.userId !== String(userId)) {
        res
          .status(403)
          .json({ error: "No autorizado para modificar este perfil" });
        return;
      }

      // VERIFICAMOS QUE SUBIÓ LA IMAGEN
      if (!file) {
        res.status(400).json({ error: "No se proporcionó ninguna imagen" });
        return;
      }

      // CONSUMIMOS EL SERVICIO EXTRAÍDO
      const imageUrl = await uploadAvatarToCloudinary(file.buffer, userId);

      // RESPUESTA EXITOSA
      res.status(200).json({
        message: "Imagen subida correctamente",
        url: imageUrl,
      });
    } catch (error) {
      console.error("Error en el endpoint de avatar:", error);
      // Podemos enviar el mensaje específico del reject de nuestra Promesa si queremos
      const errorMessage =
        error instanceof Error ? error.message : "Error interno del servidor";
      res.status(500).json({ error: errorMessage });
    }
  },
);

export default editProfile;
