import { v2 as cloudinary } from 'cloudinary';

// Asumimos que ya tienes configurado cloudinary.config() en tu app

/**
 * Función auxiliar para extraer el public_id de una URL de Cloudinary
 */
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Ejemplo de URL: https://res.cloudinary.com/nube/image/upload/v1612345/petfinder/mascota-123.jpg
    const splitUrl = url.split('/upload/');
    if (splitUrl.length < 2) return null;

    // Obtiene todo lo que está después de /upload/ (ej. v1612345/petfinder/mascota-123.jpg)
    const pathParts = splitUrl[1].split('/'); 
    
    // Elimina la versión de la ruta (el elemento que empieza con 'v', ej. v1612345)
    pathParts.shift(); 
    
    // Une el resto de la ruta (ej. petfinder/mascota-123.jpg)
    const fullPath = pathParts.join('/'); 
    
    // Quita la extensión del archivo (.jpg, .png)
    const publicId = fullPath.substring(0, fullPath.lastIndexOf('.')); 
    
    return publicId; // Retorna: petfinder/mascota-123
  } catch (error) {
    console.error("Error al extraer public_id de la URL:", url, error);
    return null;
  }
};

/**
 * Función principal para borrar múltiples imágenes de Cloudinary
 */
export const deletePetPhotos = async (photoUrls: string[]): Promise<void> => {
  if (!photoUrls || photoUrls.length === 0) return;

  try {
    // 1. Convertimos el arreglo de URLs en un arreglo de promesas de borrado
    const deletePromises = photoUrls.map((url) => {
      const publicId = extractPublicIdFromUrl(url);
      
      if (publicId) {
        // Ejecuta el borrado en Cloudinary
        return cloudinary.uploader.destroy(publicId);
      }
      return Promise.resolve(); // Si no hay publicId, resolvemos sin hacer nada
    });

    // 2. Ejecutamos todas las promesas al mismo tiempo (Concurrencia)
    await Promise.all(deletePromises);
    
    console.log(`Se han eliminado ${photoUrls.length} imágenes de Cloudinary exitosamente.`);

  } catch (error) {
    // No lanzamos un throw error aquí para no romper el flujo de la base de datos.
    // Solo registramos el error para revisarlo en los logs del servidor.
    console.error('Error crítico al intentar borrar imágenes en Cloudinary:', error);
  }
};