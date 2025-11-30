import api from './api';
import { VentesDto } from '../types';
import { DEMO_MODE } from '../config/demo';

export const ventesService = {
  // Créer ou modifier une vente
  save: async (vente: VentesDto): Promise<VentesDto> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        ...vente, 
        id: vente.id || Date.now(),
        code: vente.code || `VTE${Date.now()}`,
        dateVente: vente.dateVente || new Date().toISOString().split('T')[0]
      };
    }

    if (vente.id) {
      const response = await api.put(`/ventes/${vente.id}`, vente);
      return response.data;
    } else {
      const response = await api.post('/ventes/create', vente);
      return response.data;
    }
  },

  // Récupérer une vente par ID
  findById: async (id: number): Promise<VentesDto> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: id,
        code: `VTE${id}`,
        dateVente: '2024-01-15',
        commentaire: 'Vente de démonstration',
        ligneVentes: [
          {
            id: 1,
            quantite: 2,
            prixUnitaire: 99.99,
            article: {
              id: 1,
              codeArticle: 'ART001',
              designation: 'Produit de test'
            }
          }
        ]
      };
    }

    const response = await api.get(`/ventes/${id}`);
    return response.data;
  },

  // Récupérer une vente par code
  findByCode: async (code: string): Promise<VentesDto> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: 1,
        code: code,
        dateVente: '2024-01-15',
        commentaire: 'Vente trouvée par code'
      };
    }

    const response = await api.get(`/ventes/${code}`);
    return response.data;
  },

  // Récupérer toutes les ventes
  findAll: async (): Promise<VentesDto[]> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 1,
          code: 'VTE001',
          dateVente: '2024-01-15',
          commentaire: 'Première vente',
          ligneVentes: []
        },
        {
          id: 2,
          code: 'VTE002',
          dateVente: '2024-01-20',
          commentaire: 'Deuxième vente',
          ligneVentes: []
        }
      ];
    }

    const response = await api.get('/ventes/all');
    return response.data;
  },

  // Supprimer une vente
  delete: async (id: number): Promise<void> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    await api.delete(`/ventes/delete/${id}`);
  }
};
