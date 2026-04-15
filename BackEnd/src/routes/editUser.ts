import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '@/config/cloudinary.ts';
import { requireAuth } from '@/middleware/midToken';

const profile = Router();

// Configuración de Multer (almacenamiento en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint: POST /api/users/:userId/avatar
profile.put('user/profile/:userId/avatar',requireAuth ,upload.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    const { userId } =  res.locals.JwtPayload

    if (!file) {
      res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_avatars',
        public_id: `avatar_user_${userId}`,
        overwrite: true,
        invalidate: true,
        format: 'webp',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }
        ]
      },
      async (error, result) => {
        if (error) {
          console.error('Error en Cloudinary:', error);
          return res.status(500).json({ error: 'Error al subir la imagen' });
        }

        // Aquí puedes usar Sequelize para actualizar tu base de datos en PostgreSQL
        // const secureUrl = result?.secure_url;
        // await User.update({ avatarUrl: secureUrl }, { where: { id: userId } });

        res.status(200).json({
          message: 'Imagen subida correctamente',
          url: result?.secure_url
        });
      }
    );

    uploadStream.end(file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default profile;

/*
import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '@/config/cloudinary.ts';

const profile = Router();

// ==========================================
// 1. CONFIGURACIÓN DE MULTER (Manejo del archivo)
// ==========================================

// Aquí le decimos a Multer: "No guardes el archivo en el disco duro del servidor".
// En su lugar, guárdalo temporalmente en la memoria RAM (como un 'Buffer').
// Esto es vital porque queremos enviar la imagen directamente a Cloudinary sin crear archivos basura en nuestro servidor.
const storage = multer.memoryStorage();

// Inicializamos multer con la configuración de almacenamiento en memoria que acabamos de crear.
const upload = multer({ storage });

// ==========================================
// 2. ENDPOINT DE ACTUALIZACIÓN (PUT)
// ==========================================

// Definimos la ruta. 'upload.single("avatar")' es un middleware de Multer.
// Su trabajo es interceptar la petición, buscar un archivo adjunto llamado "avatar",
// procesarlo (guardarlo en la RAM) y ponerlo disponible en 'req.file'.
profile.put('/user/profile/:userId/avatar', upload.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  try {
    // req.file contiene la información de la imagen y los datos binarios (el Buffer).
    const file = req.file;
    
    // Extraemos el ID del usuario de la URL.
    const { userId } = req.params;

    // Validación básica: Si Multer no encontró ningún archivo llamado 'avatar', detenemos todo.
    if (!file) {
      res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      return;
    }

    // ==========================================
    // 3. LA MAGIA DE CLOUDINARY
    // ==========================================

    // Usamos 'upload_stream' porque no tenemos una ruta de archivo físico (ej. 'C:/imagenes/foto.jpg').
    // Tenemos un "chorro" de datos en la memoria RAM, y abrimos un canal directo con Cloudinary para enviárselos.
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // Opciones de configuración para esta imagen en específico:

        // 'folder': Crea (o usa) esta carpeta en tu panel de Cloudinary para mantener todo ordenado.
        folder: 'user_avatars', 

        // 'public_id': Es el nombre del archivo en Cloudinary. 
        // Al usar el ID del usuario, nos aseguramos de que siempre se llame igual (ej. avatar_user_123).
        public_id: `avatar_user_${userId}`, 

        // 'overwrite': Si ya existe una foto llamada 'avatar_user_123', bórrala y pon esta nueva. (Ahorra espacio).
        overwrite: true, 

        // 'invalidate': Cloudinary usa CDNs (servidores distribuidos por el mundo) que guardan copias en caché de las imágenes.
        // Esto fuerza a esos servidores a borrar la copia vieja y mostrar la nueva instantáneamente a los usuarios.
        invalidate: true, 

        // 'format': Convierte automáticamente la imagen (sea PNG, JPG, etc.) al formato WebP, que es súper ligero y rápido para la web.
        format: 'webp', 

        // 'transformation': Cloudinary edita la imagen por ti en sus servidores antes de guardarla.
        transformation: [
          // Corta la imagen a 400x400 píxeles. 'crop: fill' asegura que se llene el cuadro sin distorsionarse.
          // 'gravity: face' es inteligencia artificial básica de Cloudinary: detecta dónde está la cara en la foto y centra el recorte ahí.
          { width: 400, height: 400, crop: 'fill', gravity: 'face' } 
        ]
      },
      
      // Esta función se ejecuta (callback) cuando Cloudinary termina de procesar y guardar la imagen.
      async (error, result) => {
        // Si Cloudinary tuvo un problema (credenciales inválidas, archivo corrupto), nos avisa aquí.
        if (error) {
          console.error('Error en Cloudinary:', error);
          return res.status(500).json({ error: 'Error al subir la imagen' });
        }

        // Si todo salió bien, 'result' contiene toda la info de la imagen en Cloudinary.
        // result?.secure_url es el link público (https) de la imagen ya recortada y convertida a WebP.

        // Aquí usarías Sequelize para decirle a tu base de datos PostgreSQL:
        // "Oye, actualiza la columna 'avatarUrl' del usuario con este nuevo link que me dio Cloudinary".
        // await User.update({ avatarUrl: result?.secure_url }, { where: { id: userId } });

        // Le respondemos al frontend que todo fue un éxito y le enviamos la URL para que actualice la vista al instante.
        res.status(200).json({
          message: 'Imagen subida correctamente',
          url: result?.secure_url
        });
      }
    );

    // ==========================================
    // 4. INICIAR LA TRANSFERENCIA
    // ==========================================

    // Esta es la línea que "enciende" el flujo. 
    // Le decimos al stream que abrimos arriba: "Aquí tienes los datos crudos (buffer) del archivo que Multer guardó en la RAM. Empieza a enviarlos".
    uploadStream.end(file.buffer);

  } catch (error) {
    // Captura cualquier error inesperado de nuestro servidor (ej. la base de datos se cayó).
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default profile;

*/