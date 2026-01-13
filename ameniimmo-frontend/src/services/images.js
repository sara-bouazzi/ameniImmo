import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Upload plusieurs images pour une annonce
 * @param {number} annonceId - ID de l'annonce
 * @param {Array} images - Tableau de fichiers images
 * @param {string} token - Token d'authentification
 */
export const uploadImages = async (annonceId, images, token) => {
  const formData = new FormData();
  
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await axios.post(
    `${API_URL}/api/annonces/${annonceId}/upload_images/`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Supprimer une image d'une annonce
 * @param {number} annonceId - ID de l'annonce
 * @param {number} imageId - ID de l'image à supprimer
 * @param {string} token - Token d'authentification
 */
export const deleteImage = async (annonceId, imageId, token) => {
  const response = await axios.delete(
    `${API_URL}/api/annonces/${annonceId}/delete_image/`,
    {
      data: { image_id: imageId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

/**
 * Obtenir l'URL complète d'une image
 * @param {string} imagePath - Chemin relatif de l'image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};
