import { Router, Request, Response } from 'express';
import User from '@/models/users';
import bcrypt, { hash } from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"



const register = Router();

register.post('/api/auth/register', async (req: Request, res: Response) => {
    try {

        //traemos de la peticion del body
        const { name, email, password } = req.body

        //comprobamos si estan todos los datos
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Falta datos obligatorios" })
        }

        //verificamos si no existe el usuario
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: "El correo ya está registrado" });
        }

        //encriptamos el password
        const passToken = await bcrypt.hash(password, 10)

        //subimos a BD el usuario nuevo
        const newUser = await User.create(
            {
                email: email,
                password: passToken,
                name: name
            }
        )
        //creamos un token con el identificacod id y lo ponemos que expira en 1 hora
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_TOKEN!, { expiresIn: "1h" })

        //enviamos la respuesta al servidor , enviamos el resgitro de el usuario 
        //y ek token 

       return  res.send(201).json({
            messegue: "Resgitro exitoso",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            token:token
        })


 

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

});

export default register;


 