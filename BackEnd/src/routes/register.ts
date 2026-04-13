import { Router, Request, Response } from 'express';
import User from '@/models/users';
import bcrypt, { hash } from "bcrypt"


const register = Router();

register.post('/api/auth/register', async (req: Request, res: Response) => {
    try {


        //traemos de la peticion del body
        const { name, email, password } = req.body
        //comprobamos si estan todos los datos
        if (!name || !email || !password) {
            return res.send(400).json({ message: "Falta datos obligatorios" })
        }

        //verificamos si no existe el usuario
        const existingUser = User.findOne({ where: { email } })
        if (!existingUser) {
            return res.status(409).json({ message: "El correo ya está registrado" });
        }



        //encriptamos el password
        const passToken = await bcrypt.hash(password, 10)

        //subimos a BD

        const newUser = await User.create(
            {
                email: email,
                password: passToken,
                name: name
            }
        )

        res.send(201).json({
            messegue: "Resgitro exitoso",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })


    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

});

export default register;
