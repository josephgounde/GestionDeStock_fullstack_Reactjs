import api from './api';
import { DEMO_MODE } from '../config/demo';

export interface SavePhotoParams {
  id: number;
  file: File;
  title: string;
  context: 'article' | 'client' | 'fournisseur' | 'utilisateur' | 'entreprise';
}

export const photoService = {
  // Sauvegarder une photo - CORRIGÉ pour correspondre à l'API Spring Boot
  savePhoto: async (params: SavePhotoParams): Promise<any> => {
    if (DEMO_MODE) {
      // Mode démo : simuler l'upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        url: URL.createObjectURL(params.file),
        message: 'Photo sauvegardée (mode démo)'
      };
    }

    const formData = new FormData();
    formData.append('file', params.file);

    // URL corrigée pour correspondre à l'API Spring Boot
    const response = await api.post(
      `/save/${params.id}/${params.title}/${params.context}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Récupérer une photo
  getPhoto: async (id: number, context: string): Promise<string> => {
    if (DEMO_MODE) {
      // Mode démo : retourner une image par défaut
      return '/assets/default-image.png';
    }

    try {
      const response = await api.get(`/photo/${context}/${id}`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      return '/assets/default-image.png';
    }
  },

  // Supprimer une photo
  deletePhoto: async (id: number, context: string): Promise<void> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await api.delete(`/photo/${context}/${id}`);
  },

  // Valider le type de fichier
  validateFile: (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Le fichier est trop volumineux. Taille maximum : 5MB.'
      };
    }

    return { valid: true };
  },

  // Redimensionner une image (optionnel)
  resizeImage: (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
};
