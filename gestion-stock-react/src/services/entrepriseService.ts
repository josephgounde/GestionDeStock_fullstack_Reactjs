import api from './api';
import { EntrepriseDto } from '../types';
import { DEMO_MODE } from '../config/demo';

export const entrepriseService = {
  // Créer ou modifier une entreprise
  save: async (entreprise: EntrepriseDto): Promise<EntrepriseDto> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...entreprise, id: entreprise.id || Date.now() };
    }

    if (entreprise.id) {
      const response = await api.put(`/entreprises/${entreprise.id}`, entreprise);
      return response.data;
    } else {
      const response = await api.post('/entreprises/create', entreprise);
      return response.data;
    }
  },

  // Récupérer une entreprise par ID
  findById: async (id: number): Promise<EntrepriseDto> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: id,
        nom: 'Mon Entreprise',
        description: 'Description de mon entreprise',
        codeFiscal: 'FR123456789',
        email: 'contact@monentreprise.com',
        numTel: '0123456789',
        steWeb: 'www.monentreprise.com',
        adresse: {
          adresse1: '123 Rue de l\'Entreprise',
          ville: 'Paris',
          codePostale: '75001',
          pays: 'France'
        }
      };
    }

    const response = await api.get(`/entreprises/${id}`);
    return response.data;
  },

  // Récupérer toutes les entreprises
  findAll: async (): Promise<EntrepriseDto[]> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 1,
          nom: 'Mon Entreprise',
          description: 'Description de mon entreprise',
          codeFiscal: 'FR123456789',
          email: 'contact@monentreprise.com',
          numTel: '0123456789',
          steWeb: 'www.monentreprise.com'
        }
      ];
    }

    const response = await api.get('/entreprises/all');
    return response.data;
  },

  // Supprimer une entreprise
  delete: async (id: number): Promise<void> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    await api.delete(`/entreprises/delete/${id}`);
  },

  // Inscription d'une nouvelle entreprise (utilisé pour le register)
  sinscrire: async (entreprise: EntrepriseDto): Promise<EntrepriseDto> => {
    return await entrepriseService.save(entreprise);
  }
};
