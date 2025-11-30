import api from './api';
import { UtilisateurDto, ChangerMotDePasseUtilisateurDto } from '../types';

export const utilisateurService = {
  // Récupérer tous les utilisateurs
  async findAll(): Promise<UtilisateurDto[]> {
    console.log('Service: Récupération de tous les utilisateurs...');
    try {
      const response = await api.get('/utilisateurs/all');
      console.log('Service: Liste des utilisateurs récupérée:', response.data?.length, 'utilisateurs');
      return response.data;
    } catch (error: any) {
      console.error('Service: Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  async findById(id: number): Promise<UtilisateurDto> {
    const response = await api.get(`/utilisateurs/${id}`);
    return response.data;
  },

  // Récupérer un utilisateur par email
  async findByEmail(email: string): Promise<UtilisateurDto> {
    const response = await api.get(`/utilisateurs/find/${email}`);
    return response.data;
  },

  // Sauvegarder un utilisateur
  async save(utilisateur: UtilisateurDto): Promise<UtilisateurDto> {
    console.log('🔧 SERVICE: Début sauvegarde utilisateur');
    console.log('📋 SERVICE: Données à envoyer:', utilisateur);
    console.log('🌐 SERVICE: URL complète:', '/utilisateurs/create');
    
    try {
      const response = await api.post('/utilisateurs/create', utilisateur);
      console.log('✅ SERVICE: Réponse reçue du backend');
      console.log('📊 SERVICE: Status:', response.status);
      console.log('📋 SERVICE: Données reçues:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ SERVICE: Erreur lors de l\'appel API');
      console.error('📊 SERVICE: Status de l\'erreur:', error.response?.status);
      console.error('📝 SERVICE: Message d\'erreur:', error.response?.data);
      console.error('🔍 SERVICE: Erreur complète:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    console.log('Service: Tentative de suppression utilisateur ID:', id);
    console.log('Service: URL complète:', `/utilisateurs/delete/${id}`);
    
    try {
      const response = await api.delete(`/utilisateurs/delete/${id}`, {
        timeout: 10000 // 10 secondes de timeout
      });
      console.log('Service: Suppression réussie, réponse:', response);
      console.log('Service: Status:', response.status);
    } catch (error: any) {
      console.error('Service: Erreur lors de la suppression:', error);
      console.error('Service: Status de l\'erreur:', error.response?.status);
      console.error('Service: Message d\'erreur:', error.response?.data);
      throw error; // Re-lancer l'erreur pour que le slice la gère
    }
  },

  // Changer le mot de passe
  async changerMotDePasse(passwordData: ChangerMotDePasseUtilisateurDto): Promise<ChangerMotDePasseUtilisateurDto> {
    const response = await api.post('/utilisateurs/update/password', passwordData);
    return response.data;
  }
};
