import api from './api';
import { CommandeClientDto, CommandeFournisseurDto } from '../types';

export const commandeService = {
  // Commandes Client
  async findAllCommandesClient(): Promise<CommandeClientDto[]> {
    const response = await api.get('/commandesclients/all');
    return response.data;
  },

  async findCommandeClientById(id: number): Promise<CommandeClientDto> {
    try {
      const response = await api.get(`/commandesclients/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur backend pour commande client ${id}:`, error.response?.data);
      
      // Si c'est une erreur 500, on essaie de récupérer depuis la liste
      if (error.response?.status === 500) {
        console.log('🔄 Tentative de récupération depuis la liste des commandes...');
        try {
          const allCommandes = await this.findAllCommandesClient();
          const commande = allCommandes.find(c => c.id === id);
          if (commande) {
            console.log('✅ Commande trouvée dans la liste:', commande);
            return commande;
          }
        } catch (listError) {
          console.error('❌ Impossible de récupérer depuis la liste:', listError);
        }
      }
      
      throw new Error(`Impossible de charger la commande ${id}. Erreur backend: ${error.response?.status || 'Inconnue'}`);
    }
  },

  async saveCommandeClient(commande: CommandeClientDto): Promise<CommandeClientDto> {
    // Préparer les données pour le backend
    const commandeToSend = {
      ...commande,
      // Convertir la date string en format ISO pour le backend
      dateCommande: commande.dateCommande ? new Date(commande.dateCommande).toISOString() : new Date().toISOString(),
      // S'assurer que idEntreprise est défini (requis par le backend)
      idEntreprise: commande.idEntreprise || 1
    };
    
    console.log('📤 Données envoyées au backend:', commandeToSend);
    
    const response = await api.post('/commandesclients/create', commandeToSend);
    return response.data;
  },

  async deleteCommandeClient(id: number): Promise<void> {
    await api.delete(`/commandesclients/delete/${id}`);
  },

  async updateEtatCommandeClient(id: number, etat: string): Promise<CommandeClientDto> {
    const response = await api.patch(`/commandesclients/update/etat/${id}/${etat}`);
    return response.data;
  },

  async updateQuantiteCommandeClient(idCommande: number, idLigneCommande: number, quantite: number): Promise<CommandeClientDto> {
    const response = await api.patch(`/commandesclients/update/quantite/${idCommande}/${idLigneCommande}/${quantite}`);
    return response.data;
  },

  async updateClientCommandeClient(idCommande: number, idClient: number): Promise<CommandeClientDto> {
    const response = await api.patch(`/commandesclients/update/client/${idCommande}/${idClient}`);
    return response.data;
  },

  async updateArticleCommandeClient(idCommande: number, idLigneCommande: number, idArticle: number): Promise<CommandeClientDto> {
    const response = await api.patch(`/commandesclients/update/article/${idCommande}/${idLigneCommande}/${idArticle}`);
    return response.data;
  },

  async deleteLigneCommandeClient(idLigneCommande: number): Promise<CommandeClientDto> {
    const response = await api.delete(`/commandesclients/delete/article/${idLigneCommande}`);
    return response.data;
  },

  // Commandes Fournisseur
  async findAllCommandesFournisseur(): Promise<CommandeFournisseurDto[]> {
    const response = await api.get('/commandesfournisseurs/all');
    return response.data;
  },

  async findCommandeFournisseurById(id: number): Promise<CommandeFournisseurDto> {
    try {
      const response = await api.get(`/commandesfournisseurs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur backend pour commande fournisseur ${id}:`, error.response?.data);
      
      // Si c'est une erreur 500, on essaie de récupérer depuis la liste
      if (error.response?.status === 500) {
        console.log('🔄 Tentative de récupération depuis la liste des commandes fournisseurs...');
        try {
          const allCommandes = await this.findAllCommandesFournisseur();
          const commande = allCommandes.find(c => c.id === id);
          if (commande) {
            console.log('✅ Commande fournisseur trouvée dans la liste:', commande);
            return commande;
          }
        } catch (listError) {
          console.error('❌ Impossible de récupérer depuis la liste:', listError);
        }
      }
      
      throw new Error(`Impossible de charger la commande fournisseur ${id}. Erreur backend: ${error.response?.status || 'Inconnue'}`);
    }
  },

  async saveCommandeFournisseur(commande: CommandeFournisseurDto): Promise<CommandeFournisseurDto> {
    // Préparer les données pour le backend
    const commandeToSend = {
      ...commande,
      // Convertir la date string en format ISO pour le backend
      dateCommande: commande.dateCommande ? new Date(commande.dateCommande).toISOString() : new Date().toISOString(),
      // S'assurer que idEntreprise est défini (requis par le backend)
      idEntreprise: commande.idEntreprise || 1
    };
    
    console.log('📤 Données commande fournisseur envoyées au backend:', commandeToSend);
    
    const response = await api.post('/commandesfournisseurs/create', commandeToSend);
    return response.data;
  },

  async deleteCommandeFournisseur(id: number): Promise<void> {
    await api.delete(`/commandesfournisseurs/delete/${id}`);
  },

  async updateEtatCommandeFournisseur(id: number, etat: string): Promise<CommandeFournisseurDto> {
    const response = await api.patch(`/commandesfournisseurs/update/etat/${id}/${etat}`);
    return response.data;
  },

  async updateQuantiteCommandeFournisseur(idCommande: number, idLigneCommande: number, quantite: number): Promise<CommandeFournisseurDto> {
    const response = await api.patch(`/commandesfournisseurs/update/quantite/${idCommande}/${idLigneCommande}/${quantite}`);
    return response.data;
  },

  async updateFournisseurCommandeFournisseur(idCommande: number, idFournisseur: number): Promise<CommandeFournisseurDto> {
    const response = await api.patch(`/commandesfournisseurs/update/fournisseur/${idCommande}/${idFournisseur}`);
    return response.data;
  },

  async updateArticleCommandeFournisseur(idCommande: number, idLigneCommande: number, idArticle: number): Promise<CommandeFournisseurDto> {
    const response = await api.patch(`/commandesfournisseurs/update/article/${idCommande}/${idLigneCommande}/${idArticle}`);
    return response.data;
  },

  async deleteLigneCommandeFournisseur(idLigneCommande: number): Promise<CommandeFournisseurDto> {
    const response = await api.delete(`/commandesfournisseurs/delete/article/${idLigneCommande}`);
    return response.data;
  }
};
