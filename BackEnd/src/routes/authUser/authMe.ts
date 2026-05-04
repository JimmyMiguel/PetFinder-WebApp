import { Router, Request, Response } from 'express';
import { requireAuth } from '@/middleware/midToken';
import User from '@/models/users';
 
const authRouter = Router();

authRouter.get("/auth/me", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extraemos el ID exactamente como lo hicimos en los otros endpoints
const { id } = res.locals.JwtPayload;

    if (!id) {
      res.status(401).json({ message: "Token inválido o mal formado" });
      return;
    }

    // 2. Buscamos al usuario, pero EXCLUYENDO LA CONTRASEÑA por seguridad
    const currentUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // 🔐 Regla de oro en autenticación
    });

    // 3. Comprobamos si el usuario existe (puede que el token sea válido pero el usuario fue borrado)
    if (!currentUser) {
      res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
      return;
    }

    // 4. Devolvemos la información del usuario limpia
    res.status(200).json({ user: currentUser });

  } catch (error) {
    console.error("Error en /auth/me:", error);
    res.status(500).json({ message: "Error interno al buscar el usuario" });
  }
});

export default authRouter;