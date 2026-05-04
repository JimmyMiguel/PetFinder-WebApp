import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import Pet from "@/models/pets";
import User from "@/models/users";
import { Resend } from "resend"; 

const adoptPets = Router();
const resend = new Resend(process.env.RESEND_API_KEY as string);

// CORRECCIÓN: Endpoint cambiado a /pets/:id/adopt
adoptPets.post("/pets/:id/adopt", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const petId = req.params.id as string;

      // CORRECCIÓN JWT: Extraemos 'id' y lo renombramos a 'adopterId'
      const { id: adopterId } = res.locals.JwtPayload;

      const pet = await Pet.findByPk(petId, {
        include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
      });

      if (!pet) {
        res.status(404).json({ error: "La publicación de esta mascota no existe." });
        return;
      }

      // CORRECCIÓN LÓGICA: Validar que esté en adopción
      if (pet.status !== "EN_ADOPCION") {
        res.status(400).json({ error: "Esta mascota no está disponible para adopción." });
        return;
      }

      if (pet.userId === adopterId) {
        res.status(400).json({ error: "No puedes adoptar una mascota que tú mismo publicaste." });
        return;
      }

      const adopter = await User.findByPk(adopterId, { attributes: ["name", "email", "phone"] });

      if (!adopter) {
        res.status(404).json({ error: "No se pudieron obtener tus datos de usuario." });
        return;
      }

      const ownerData = (pet as any).owner;

      // CORRECCIÓN TEXTO CORREO: Adaptado para adopciones
      const { error } = await resend.emails.send({
        from: "Petfinder <onboarding@resend.dev>",
        to: ownerData.email,
        subject: `¡Alguien quiere adoptar a ${pet.animal_type}! ❤️🐾`,
        html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hola, ${ownerData.name} 👋</h2>
          <p>¡Qué emoción! El usuario <strong>${adopter.name}</strong> está interesado en darle un hogar al ${pet.animal_type} que publicaste para adopción.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Datos del posible adoptante:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li>👤 <strong>Nombre:</strong> ${adopter.name}</li>
              <li>📧 <strong>Email:</strong> ${adopter.email}</li>
              <li>📱 <strong>Teléfono:</strong> ${adopter.phone || "No registrado"}</li>
            </ul>
          </div>
          
          <p>Por favor, ponte en contacto con esta persona para iniciar el proceso de adopción.</p>
        </div>
      `,
      });

      if (error) {
        console.error("Error API Resend:", error);
        res.status(500).json({ error: "Error en el servicio de correos." });
        return;
      }

      res.status(200).json({ message: "¡Solicitud de adopción enviada al dueño!" });
      
    } catch (error) {
      res.status(500).json({ error: "Error interno al procesar tu solicitud." });
    }
  }
);

export default adoptPets;