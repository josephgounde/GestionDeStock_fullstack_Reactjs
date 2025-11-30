// Services mockés pour la démonstration sans backend

import { mockArticles, mockClients, mockFournisseurs, mockCategories, mockUtilisateurs, mockCommandes, mockMouvements } from '../data/mockData';

// Simulation d'un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockArticleService = {
  findAll: async () => {
    await delay(500);
    return mockArticles;
  },
  findById: async (id: number) => {
    await delay(300);
    return mockArticles.find(a => a.id === id) || mockArticles[0];
  },
  save: async (article: any) => {
    await delay(400);
    return { ...article, id: article.id || Date.now() };
  },
  delete: async (id: number) => {
    await delay(300);
    return id;
  }
};

export const mockClientService = {
  findAll: async () => {
    await delay(500);
    return mockClients;
  },
  findById: async (id: number) => {
    await delay(300);
    return mockClients.find(c => c.id === id) || mockClients[0];
  },
  save: async (client: any) => {
    await delay(400);
    return { ...client, id: client.id || Date.now() };
  },
  delete: async (id: number) => {
    await delay(300);
    return id;
  }
};

export const mockFournisseurService = {
  findAll: async () => {
    await delay(500);
    return mockFournisseurs;
  },
  findById: async (id: number) => {
    await delay(300);
    return mockFournisseurs.find(f => f.id === id) || mockFournisseurs[0];
  },
  save: async (fournisseur: any) => {
    await delay(400);
    return { ...fournisseur, id: fournisseur.id || Date.now() };
  },
  delete: async (id: number) => {
    await delay(300);
    return id;
  }
};

export const mockCategoryService = {
  findAll: async () => {
    await delay(500);
    return mockCategories;
  },
  findById: async (id: number) => {
    await delay(300);
    return mockCategories.find(c => c.id === id) || mockCategories[0];
  },
  save: async (category: any) => {
    await delay(400);
    return { ...category, id: category.id || Date.now() };
  },
  delete: async (id: number) => {
    await delay(300);
    return id;
  }
};

export const mockUtilisateurService = {
  findAll: async () => {
    await delay(500);
    return mockUtilisateurs;
  },
  findById: async (id: number) => {
    await delay(300);
    return mockUtilisateurs.find(u => u.id === id) || mockUtilisateurs[0];
  },
  save: async (utilisateur: any) => {
    await delay(400);
    return { ...utilisateur, id: utilisateur.id || Date.now() };
  },
  delete: async (id: number) => {
    await delay(300);
    return id;
  }
};

export const mockCommandeService = {
  findAllCommandesClient: async () => {
    await delay(500);
    return mockCommandes.filter(c => c.client);
  },
  findAllCommandesFournisseur: async () => {
    await delay(500);
    return mockCommandes.filter(c => c.fournisseur);
  },
  findCommandeClientById: async (id: number) => {
    await delay(300);
    return mockCommandes.find(c => c.id === id && c.client) || mockCommandes[0];
  },
  findCommandeFournisseurById: async (id: number) => {
    await delay(300);
    return mockCommandes.find(c => c.id === id && c.fournisseur) || mockCommandes[1];
  },
  saveCommandeClient: async (commande: any) => {
    await delay(400);
    return { ...commande, id: commande.id || Date.now() };
  },
  saveCommandeFournisseur: async (commande: any) => {
    await delay(400);
    return { ...commande, id: commande.id || Date.now() };
  },
  updateEtatCommandeClient: async (id: number, etat: string) => {
    await delay(300);
    return { id, etatCommande: etat };
  },
  updateEtatCommandeFournisseur: async (id: number, etat: string) => {
    await delay(300);
    return { id, etatCommande: etat };
  }
};

export const mockMvtStkService = {
  findAll: async () => {
    await delay(500);
    return mockMouvements;
  },
  findByArticle: async (articleId: number) => {
    await delay(300);
    return mockMouvements.filter(m => m.article?.id === articleId);
  },
  stockReelArticle: async (articleId: number) => {
    await delay(200);
    return Math.floor(Math.random() * 100) + 10; // Stock aléatoire entre 10 et 110
  }
};

// Mode démonstration - remplace les vrais services
export const isDemoMode = false;
