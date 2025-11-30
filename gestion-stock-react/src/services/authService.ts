import api from './api';
import { AuthenticationRequest, AuthenticationResponse, UtilisateurDto, ChangerMotDePasseUtilisateurDto } from '../types';

export const authService = {
  // Authentification
  async authenticate(credentials: AuthenticationRequest): Promise<AuthenticationResponse> {
    const response = await api.post('/auth/authenticate', credentials);
    return response.data;
  },

  // Récupérer un utilisateur par email
  async getUserByEmail(email: string): Promise<UtilisateurDto> {
    const response = await api.get(`/utilisateurs/find/${email}`);
    return response.data;
  },

  // Changer le mot de passe
  async changePassword(passwordData: ChangerMotDePasseUtilisateurDto): Promise<void> {
    await api.post('/utilisateurs/update/password', passwordData);
  },

  // Inscription (si nécessaire)
  async register(userData: UtilisateurDto): Promise<UtilisateurDto> {
    const response = await api.post('/utilisateurs/create', userData);
    return response.data;
  },

  // Déconnexion
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
  },

  // Vérifier si le token est valide
  isTokenValid(): boolean {
    const tokenData = localStorage.getItem('accessToken');
    if (!tokenData) return false;
    
    try {
      const parsed = JSON.parse(tokenData);
      // Ici, vous pourriez ajouter une vérification de l'expiration du token
      return !!parsed.accessToken;
    } catch (error) {
      return false;
    }
  },

  // Récupérer l'utilisateur connecté
  getConnectedUser(): UtilisateurDto | null {
    const userData = localStorage.getItem('connectedUser');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
};
