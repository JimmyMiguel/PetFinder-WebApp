import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import User from "@/models/users";
import Pet from "@/models/pets";
import { deflate } from "node:zlib";

const profile = Router();

profile.get("/users/profile", requireAuth, async (req, res) => {
  try {
    //traido el id del middlewere
    const userId = res.locals.JwtPayload.id;
    //busco el usuario
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    //traigo a las mascotas del usuario
    const userPets = await Pet.findAll({
      where: { userId: userId },
    });

    return res.status(200).json({
      user,
      userPets,
    });
  } catch (error) {
    console.error("Error al obtener el perfil y mascotas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default profile;
