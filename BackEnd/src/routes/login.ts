import { Router, Request, Response } from 'express';
import User from '@/models/users';
import bcrypt from "bcrypt"; // No necesitas importar 'hash' aquí si solo vas a comparar
import jwt from "jsonwebtoken";

const login = Router();

login.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Busca en la base de datos
    const userFind = await User.findOne({
      where: { email: email }
    });

    // 2. Si el usuario no existe, devolvemos un mensaje genérico con estado 401 (Unauthorized)
    if (!userFind) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" }); // Corregido 'messege' a 'message'
    }

    // 3. Compara la contraseña  
    const passGood = await bcrypt.compare(password, userFind.password);
    
    // Si la contraseña no coincide, devolvemos EL MISMO mensaje genérico
    if (!passGood) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    // 4. Genero un JWT con el ID del usuario que expira en 1 hora
    const token = jwt.sign(
      { id: userFind.id }, 
      process.env.JWT_TOKEN!, 
      { expiresIn: "1h" }  
    );

    // 5. Todo salió bien, devolvemos el token
    return res.json({ token });

  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default login;  