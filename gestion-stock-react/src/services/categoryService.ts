import api from './api';
import { CategoryDto } from '../types';

export const categoryService = {
  // Récupérer toutes les catégories
  async findAll(): Promise<CategoryDto[]> {
    const response = await api.get('/categories/all');
    return response.data;
  },

  // Récupérer une catégorie par ID
  async findById(id: number): Promise<CategoryDto> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Récupérer une catégorie par code
  async findByCode(code: string): Promise<CategoryDto> {
    const response = await api.get(`/categories/filter/${code}`);
    return response.data;
  },

  // Sauvegarder une catégorie
  async save(category: CategoryDto): Promise<CategoryDto> {
    const response = await api.post('/categories/create', category);
    return response.data;
  },

  // Supprimer une catégorie
  async delete(id: number): Promise<void> {
    await api.delete(`/categories/delete/${id}`);
  }
};
