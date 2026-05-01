 import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/midToken";
import Pet from "@/models/pets";
import User from "@/models/users";
import { Resend } from 'resend'; // ✅ Importamos Resend

const petRoutes = Router();

// Inicializamos el cliente usando la llave de tu archivo .env
// Asegúrate de agregar RESEND_API_KEY a tus variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY as string);

// Endpoint: POST /api/pets/:id/claim
petRoutes.post("/pets/:id/claim", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const petId = req.params.id as string;
    
    // 1. Obtener el ID del "Dueño" (quien hace clic en el botón)
    const { userId: claimerId } = res.locals.JwtPayload;

    // 2. Buscar la mascota y los datos del "Rescatista"
    const pet = await Pet.findByPk(petId, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!pet) {
      res.status(404).json({ error: "La publicación de esta mascota no existe." });
      return;
    }

    // 3. Validaciones de Negocio
    if (pet.status !== 'ENCONTRADA') {
      res.status(400).json({ error: "Solo puedes reclamar mascotas que estén reportadas como encontradas." });
      return;
    }

    if (pet.userId === claimerId) {
      res.status(400).json({ error: "No puedes reclamar una mascota que tú mismo publicaste." });
      return;
    }

    // 4. Buscar los datos de contacto del "Dueño"
    const claimer = await User.findByPk(claimerId, {
      attributes: ["name", "email"],
    });

    if (!claimer) {
      res.status(404).json({ error: "No se pudieron obtener tus datos de usuario." });
      return;
    }

    const finderData = (pet as any).owner;

    // 5. Enviar el correo usando Resend
    const { data, error } = await resend.emails.send({
 
      from: 'Petfinder <onboarding@resend.dev>', 
      to: finderData.email,
      subject: `¡Alguien busca al ${pet.animal_type} que encontraste! 🐾`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hola, ${finderData.name} 👋</h2>
          <p>¡Excelentes noticias! El usuario <strong>${claimer.name}</strong> ha visto tu publicación y cree que el ${pet.animal_type} que encontraste en <em>${pet.location_text}</em> es su mascota.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Datos de contacto del posible dueño:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li>👤 <strong>Nombre:</strong> ${claimer.name}</li>
              <li>📧 <strong>Email:</strong> ${claimer.email}</li>
             </ul>
          </div>
          
          <p>Por favor, ponte en contacto con esta persona lo antes posible para intercambiar fotos, validar información y coordinar el reencuentro.</p>
        </div>
      `,
    });

    // Resend no lanza una excepción por defecto si el correo falla (ej. error de dominio), 
    // sino que te devuelve el error en el objeto destrurcturado. Lo atrapamos aquí:
    if (error) {
      console.error("Error devuelto por la API de Resend:", error);
      res.status(500).json({ error: "Ocurrió un error en el servicio de correos. Intenta más tarde." });
      return;
    }

    // 6. Responder al frontend
    res.status(200).json({
      message: "¡Solicitud enviada! Le hemos enviado un correo a la persona que encontró a la mascota con tus datos de contacto.",
    });

  } catch (error) {
    console.error("Error general en el endpoint de reclamación:", error);
    res.status(500).json({ error: "Error interno al procesar tu solicitud o enviar el correo." });
  }
});

export default petRoutes;