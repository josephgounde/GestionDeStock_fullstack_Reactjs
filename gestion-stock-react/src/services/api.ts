import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration de base pour Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/gestiondestock/v1';

// Instance Axios avec configuration de base
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('accessToken');
      localStorage.removeItem('connectedUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour récupérer le token
function getAuthToken(): string | null {
  const tokenData = localStorage.getItem('accessToken');
  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      return parsed.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
}

// Fonction utilitaire pour vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!token;
}

// Fonction utilitaire pour récupérer l'utilisateur connecté
export function getConnectedUser(): any {
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

export default api;
