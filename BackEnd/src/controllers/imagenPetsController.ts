// src/controllers/imagenPetsController.ts

// 1. Importamos la configuración de Cloudinary que ya tienes definida en otro archivo.
 import cloudinary from '@/config/cloudinary';

/**
 * Sube una imagen (buffer) de mascota a Cloudinary y retorna la URL segura.
 */
// 2. Definimos y exportamos la función. Recibe tres parámetros:
// - fileBuffer: Los datos crudos de la imagen en memoria (Buffer).
// - petId: El ID de la mascota para nombrar el archivo.
// - photoIndex: Un número para diferenciar si subes varias fotos de la misma mascota (ej. foto 0, foto 1).
// Retorna una Promesa que, cuando se resuelva, entregará un string (la URL de la imagen).
export const uploadPetPhotoToCloudinary = (fileBuffer: Buffer, petId: string, photoIndex: number): Promise<string> => {
  
  // 3. Retornamos una nueva Promesa. Como 'upload_stream' de Cloudinary funciona con callbacks (funciones que se ejecutan al terminar),
  // envolverlo en una Promesa nos permite usar 'await' cuando llamemos a esta función.
  return new Promise((resolve, reject) => {
    
    // 4. Creamos un "flujo de subida" (upload stream) hacia Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // 5. Configuraciones de la imagen en Cloudinary:
        folder: 'pet_photos', // Crea o usa la carpeta 'pet_photos' en tu cuenta de Cloudinary.
        public_id: `pet_${petId}_photo_${photoIndex}`, // Genera un nombre único, ej: "pet_123_photo_0".
        overwrite: true, // Si ya existe una foto con ese nombre exacto, la reemplaza.
        invalidate: true, // Borra la versión antigua de la caché global (CDN) para que los usuarios vean la nueva.
        format: 'webp', // Convierte la imagen a WebP, un formato súper ligero ideal para la web.
        transformation: [
          // 6. Recorta y redimensiona la imagen a 600x600 píxeles. 
          // crop: 'fill' asegura que llene el cuadro sin deformarse.
          // gravity: 'auto' usa IA de Cloudinary para centrar el recorte en lo más importante (ej. la cara de la mascota).
          { width: 600, height: 600, crop: 'fill', gravity: 'auto' } 
        ]
      },
      
      // 7. Este es el callback que se ejecuta cuando Cloudinary termina de procesar la imagen (o si falla).
      (error, result) => {
        // 8. Si hubo un error en la subida...
        if (error) {
          console.error('Error interno en Cloudinary:', error);
          // Rechazamos la promesa con un mensaje de error claro.
          return reject(new Error('Error al subir la imagen a Cloudinary'));
        }
        
        // 9. Si no hubo error y Cloudinary nos devolvió un resultado con una URL segura (HTTPS)...
        if (result && result.secure_url) {
          // Resolvemos la promesa entregando esa URL. ¡Éxito!
          resolve(result.secure_url);
        } else {
          // 10. Un caso extremo: no hubo error, pero por alguna razón no nos dio la URL.
          reject(new Error('No se obtuvo una URL válida de Cloudinary'));
        }
      }
    );

    // 11. ¡Muy importante! Las líneas anteriores solo *configuraron* el stream.
    // Esta línea es la que realmente inyecta el archivo (el Buffer) en el stream y le dice "termina de enviarlo".
    uploadStream.end(fileBuffer);
  });
};

/**
 * Sube múltiples fotos de mascota a Cloudinary.
 */
// 12. Definimos una función asíncrona para subir varias fotos a la vez.
// Recibe un array de Buffers (varias imágenes) y el ID de la mascota.
export const uploadMultiplePetPhotos = async (
  fileBuffers: Buffer[],
  petId: string
): Promise<string[]> => { // Promete devolver un array de strings (las URLs de todas las fotos).

  // 13. Usamos .map() para recorrer el array de imágenes.
  // Por cada imagen, llamamos a la función individual de arriba.
  // IMPORTANTE: Esto NO espera a que termine una para empezar la otra. 
  // Crea un array de Promesas "pendientes" que se ejecutan al mismo tiempo.
  const uploadPromises = fileBuffers.map((buffer, index) =>
    uploadPetPhotoToCloudinary(buffer, petId, index)
  );

  // 14. Promise.all() toma ese array de promesas y espera a que TODAS terminen con éxito.
  // Si subes 5 fotos, se suben en paralelo (mucho más rápido que una por una).
  // Retorna el array con todas las URLs ya resueltas.
  return Promise.all(uploadPromises);
};