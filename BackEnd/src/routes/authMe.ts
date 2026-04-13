import { Router, Request, Response } from 'express';
import { requireAuth } from '@/middleware/midToken';
import User from '@/models/users';



const authRouter = Router()


authRouter.get("/api/auth/me", requireAuth, async (req:Request,res:Response)=>{
    //tremos el usuario de el middlewere
    const {user} = res.locals.JwtPayload
    //comprobamos si esta correcto 
if (!user || !user.id) {
    return res.status(401).json({ message: "No autorizado" });
  }

try {
    //si es correcto el token, buscamos el id de el usuario
    const userId = await User.findByPk(user.id)
    //comprobamos si exite el usuario , auque ya hay una comprobacion previa
    if (!userId) {
        return res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
      }


      res.json({ user: userId });


} catch (error) {
    res.status(500).json({ message: "Error al buscar el usuario" });

}



})