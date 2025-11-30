import api from './api';
import { MvtStkDto } from '../types';

export const mvtStkService = {
  // Récupérer tous les mouvements de stock
  async findAll(): Promise<MvtStkDto[]> {
    const response = await api.get('/mvtstk/all');
    return response.data;
  },

  // Récupérer les mouvements de stock par article
  async findByArticle(idArticle: number): Promise<MvtStkDto[]> {
    const response = await api.get(`/mvtstk/filter/article/${idArticle}`);
    return response.data;
  },

  // Récupérer le stock réel d'un article
  async stockReelArticle(idArticle: number): Promise<number> {
    const response = await api.get(`/mvtstk/stockreel/${idArticle}`);
    return response.data;
  },

  // Entrée de stock
  async entreeStock(mvtStk: MvtStkDto): Promise<MvtStkDto> {
    const response = await api.post('/mvtstk/entree', mvtStk);
    return response.data;
  },

  // Sortie de stock
  async sortieStock(mvtStk: MvtStkDto): Promise<MvtStkDto> {
    const response = await api.post('/mvtstk/sortie', mvtStk);
    return response.data;
  },

  // Correction de stock positive
  async correctionStockPos(mvtStk: MvtStkDto): Promise<MvtStkDto> {
    const response = await api.post('/mvtstk/correctionpos', mvtStk);
    return response.data;
  },

  // Correction de stock négative
  async correctionStockNeg(mvtStk: MvtStkDto): Promise<MvtStkDto> {
    const response = await api.post('/mvtstk/correctionneg', mvtStk);
    return response.data;
  },

  // Sauvegarder un mouvement de stock générique
  async save(mvtStk: MvtStkDto): Promise<MvtStkDto> {
    const response = await api.post('/mvtstk/create', mvtStk);
    return response.data;
  }
};
