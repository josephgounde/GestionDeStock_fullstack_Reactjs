import api from './api';
import { ClientDto } from '../types';

export const clientService = {
  // Récupérer tous les clients
  async findAll(): Promise<ClientDto[]> {
    const response = await api.get('/clients/all');
    return response.data;
  },

  // Récupérer un client par ID
  async findById(id: number): Promise<ClientDto> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Sauvegarder un client
  async save(client: ClientDto): Promise<ClientDto> {
    const response = await api.post('/clients/create', client);
    return response.data;
  },

  // Supprimer un client
  async delete(id: number): Promise<void> {
    await api.delete(`/clients/delete/${id}`);
  }
};
