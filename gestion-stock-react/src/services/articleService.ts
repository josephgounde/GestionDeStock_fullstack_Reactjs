import api from './api';
import { ArticleDto, LigneVenteDto, LigneCommandeClientDto, LigneCommandeFournisseurDto } from '../types';
import { mockArticleService, isDemoMode } from './mockServices';

export const articleService = {
  findAll: async (): Promise<ArticleDto[]> => {
    if (isDemoMode) {
      return mockArticleService.findAll();
    }
    const response = await api.get('/articles/all');
    return response.data;
  },

  findById: async (id: number): Promise<ArticleDto> => {
    if (isDemoMode) {
      return mockArticleService.findById(id);
    }
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  save: async (article: ArticleDto): Promise<ArticleDto> => {
    if (isDemoMode) {
      return mockArticleService.save(article);
    }
    const response = await api.post('/articles/create', article);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (isDemoMode) {
      await mockArticleService.delete(id);
      return;
    }
    await api.delete(`/articles/delete/${id}`);
  },

  // Rechercher un article par code
  findByCodeArticle: async (codeArticle: string): Promise<ArticleDto> => {
    if (isDemoMode) {
      return mockArticleService.findById(1); // Retourner un article de démo
    }
    const response = await api.get(`/articles/filter/${codeArticle}`);
    return response.data;
  },

  // Lister les articles par catégorie
  findAllArticleByIdCategory: async (idCategory: number): Promise<ArticleDto[]> => {
    if (isDemoMode) {
      return mockArticleService.findAll(); // Retourner tous les articles de démo
    }
    const response = await api.get(`/articles/filter/category/${idCategory}`);
    return response.data;
  },

  // Récupérer l'historique des ventes d'un article
  findHistoriqueVentes: async (idArticle: number): Promise<LigneVenteDto[]> => {
    const response = await api.get(`/articles/historique/vente/${idArticle}`);
    return response.data;
  },

  // Récupérer l'historique des commandes client d'un article
  findHistoriqueCommandeClient: async (idArticle: number): Promise<LigneCommandeClientDto[]> => {
    const response = await api.get(`/articles/historique/commandeclient/${idArticle}`);
    return response.data;
  },

  // Récupérer l'historique des commandes fournisseur d'un article
  findHistoriqueCommandeFournisseur: async (idArticle: number): Promise<LigneCommandeFournisseurDto[]> => {
    const response = await api.get(`/articles/historique/commandefournisseur/${idArticle}`);
    return response.data;
  }
};
