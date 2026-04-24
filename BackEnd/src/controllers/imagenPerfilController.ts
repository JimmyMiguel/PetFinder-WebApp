// src/services/imageService.ts
import cloudinary from '@/config/cloudinary';

/**
 * Sube una imagen (buffer) a Cloudinary y retorna la URL segura.
 */
export const uploadAvatarToCloudinary = (fileBuffer: Buffer, userId: string | number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_avatars', // CARPETA DONDE SE GUARDA
        public_id: `avatar_user_${userId}`, // Identificador para cada usuario
        overwrite: true, // Sobrescribir lo que ya había
        invalidate: true, // Sobrescribe en la caché de los CDN
        format: 'webp', // Formato de la imagen liviano
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' } // Tamaño para que se vea bien
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Error interno en Cloudinary:', error);
          return reject(new Error('Error al subir la imagen a Cloudinary'));
        }
        
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('No se obtuvo una URL válida de Cloudinary'));
        }
      }
    );

    // Finalizamos el stream enviando el buffer del archivo
    uploadStream.end(fileBuffer);
  });
};