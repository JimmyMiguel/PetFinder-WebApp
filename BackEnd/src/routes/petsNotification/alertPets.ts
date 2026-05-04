import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import Pet from "@/models/pets";
import User from "@/models/users";
import { Resend } from 'resend'; 

const alertPets = Router();
const resend = new Resend(process.env.RESEND_API_KEY as string);

// Endpoint: POST /pets/:id/claim (RECLAMAR MASCOTA ENCONTRADA)
alertPets.post("/pets/:id/claim", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const petId = req.params.id as string;
    
    // CORRECCIÓN JWT: Extraemos 'id' y lo renombramos a 'claimerId'
    const { id: claimerId } = res.locals.JwtPayload;

    const pet = await Pet.findByPk(petId, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
    });

    if (!pet) {
      res.status(404).json({ error: "La publicación de esta mascota no existe." });
      return;
    }

    if (pet.status !== 'ENCONTRADA') {
      res.status(400).json({ error: "Solo puedes reclamar mascotas que estén reportadas como encontradas." });
      return;
    }

    if (pet.userId === claimerId) {
      res.status(400).json({ error: "No puedes reclamar una mascota que tú mismo publicaste." });
      return;
    }

    const claimer = await User.findByPk(claimerId, { attributes: ["name", "email", "phone"] });

    if (!claimer) {
      res.status(404).json({ error: "No se pudieron obtener tus datos de usuario." });
      return;
    }

    const finderData = (pet as any).owner;

    const { error } = await resend.emails.send({
      from: 'Petfinder <onboarding@resend.dev>', 
      to: finderData.email,
      subject: `¡Alguien busca al ${pet.animal_type} que encontraste! 🐾`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hola, ${finderData.name} 👋</h2>
          <p>¡Excelentes noticias! El usuario <strong>${claimer.name}</strong> cree que el ${pet.animal_type} que encontraste es su mascota.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding-left: 0;">
              <li>👤 <strong>Nombre:</strong> ${claimer.name}</li>
              <li>📧 <strong>Email:</strong> ${claimer.email}</li>
              <li>📱 <strong>Teléfono:</strong> ${claimer.phone || "No registrado"}</li>
            </ul>
          </div>
          <p>Por favor, ponte en contacto para coordinar el reencuentro.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error API Resend:", error);
      res.status(500).json({ error: "Error en el servicio de correos." });
      return;
    }

    res.status(200).json({ message: "¡Solicitud de reclamo enviada!" });

  } catch (error) {
    res.status(500).json({ error: "Error interno al procesar tu solicitud." });
  }
});

export default alertPets;