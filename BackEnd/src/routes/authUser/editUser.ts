import { Router, Request, Response } from "express";
import multer from "multer";
import { requireAuth } from "@/middleware/midToken";
import { uploadAvatarToCloudinary } from "@/controllers/imagenPerfilController";
import bcrypt from "bcrypt";
import User from "@/models/users";

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

      // ACTUALIZAMOS EL USUARIO EN LA BD (Faltaba este paso)
      await User.update({ profile_picture: imageUrl }, { where: { id: userId } });

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

// NUEVO: Endpoint para actualizar nombre y contraseña
// PUT /api/user/profile
editProfile.put(
  "/user/profile",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: userId } = res.locals.JwtPayload;
      const { name, password } = req.body;

      const updateData: any = {};

      // Solo agregamos al objeto de actualización si el usuario envió el dato
      if (name) updateData.name = name;
      
      if (password && password.length >= 8) {
        updateData.password = await bcrypt.hash(password, 10);
      } else if (password) {
        res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
        return;
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
        return;
      }

      await User.update(updateData, { where: { id: userId } });

      res.status(200).json({
        message: "Perfil actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
);

export default editProfile;
