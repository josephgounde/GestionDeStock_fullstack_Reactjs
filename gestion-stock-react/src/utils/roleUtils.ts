import { UtilisateurDto } from '../types';

/**
 * Utilitaires pour la gestion des rôles utilisateur
 * Basé sur la logique du projet Angular de référence
 */

/**
 * Détermine le rôle principal de l'utilisateur
 * Si aucun rôle n'est défini, retourne 'USER' par défaut
 * @param user - L'utilisateur connecté
 * @returns Le rôle principal de l'utilisateur
 */
export const getPrincipalRole = (user?: UtilisateurDto | null): string => {
  if (!user?.roles || user.roles.length === 0) {
    return 'USER'; // Rôle par défaut comme dans le projet Angular
  }
  return user.roles[0].roleName || 'USER';
};

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité selon les rôles requis
 * @param user - L'utilisateur connecté
 * @param requiredRoles - Les rôles requis pour accéder à la fonctionnalité
 * @returns true si l'utilisateur a accès, false sinon
 */
export const hasAccess = (user?: UtilisateurDto | null, requiredRoles?: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  const userRole = getPrincipalRole(user);
  return requiredRoles.includes(userRole);
};

/**
 * Vérifie si l'utilisateur est un administrateur
 * @param user - L'utilisateur connecté
 * @returns true si l'utilisateur est admin, false sinon
 */
export const isAdmin = (user?: UtilisateurDto | null): boolean => {
  return getPrincipalRole(user) === 'ADMIN';
};

/**
 * Vérifie si l'utilisateur est un gestionnaire (manager)
 * @param user - L'utilisateur connecté
 * @returns true si l'utilisateur est manager, false sinon
 */
export const isManager = (user?: UtilisateurDto | null): boolean => {
  return getPrincipalRole(user) === 'MANAGER';
};

/**
 * Vérifie si l'utilisateur est un utilisateur standard
 * @param user - L'utilisateur connecté
 * @returns true si l'utilisateur est user, false sinon
 */
export const isUser = (user?: UtilisateurDto | null): boolean => {
  return getPrincipalRole(user) === 'USER';
};

/**
 * Obtient le libellé du rôle pour l'affichage
 * @param user - L'utilisateur connecté
 * @returns Le libellé du rôle
 */
export const getRoleLabel = (user?: UtilisateurDto | null): string => {
  const role = getPrincipalRole(user);
  switch (role) {
    case 'ADMIN':
      return 'Administrateur';
    case 'MANAGER':
      return 'Gestionnaire';
    case 'USER':
      return 'Utilisateur';
    default:
      return 'Utilisateur';
  }
};
