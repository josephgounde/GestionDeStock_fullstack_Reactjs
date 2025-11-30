import api from './api';
import { FournisseurDto } from '../types';

export const fournisseurService = {
  // Récupérer tous les fournisseurs
  async findAll(): Promise<FournisseurDto[]> {
    const response = await api.get('/fournisseurs/all');
    return response.data;
  },

  // Récupérer un fournisseur par ID
  async findById(id: number): Promise<FournisseurDto> {
    const response = await api.get(`/fournisseurs/${id}`);
    return response.data;
  },

  // Sauvegarder un fournisseur
  async save(fournisseur: FournisseurDto): Promise<FournisseurDto> {
    const response = await api.post('/fournisseurs/create', fournisseur);
    return response.data;
  },

  // Supprimer un fournisseur
  async delete(id: number): Promise<void> {
    await api.delete(`/fournisseurs/delete/${id}`);
  }
};
