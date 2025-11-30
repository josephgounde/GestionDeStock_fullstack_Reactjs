import { useAppSelector } from './redux';

export const useRoles = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const hasRole = (roleName: string): boolean => {
    return user?.roles?.some(role => role.roleName === roleName) || false;
  };
  
  const isAdmin = (): boolean => hasRole('ADMIN');
  const isUser = (): boolean => hasRole('USER');
  const isManager = (): boolean => hasRole('MANAGER');
  const isComptable = (): boolean => hasRole('COMPTABLE');
  const isVendeur = (): boolean => hasRole('VENDEUR');
  
  const canAccess = (resource: string): boolean => {
    // Dans le projet Angular de référence, la gestion des utilisateurs était accessible à tous les connectés
    // mais avec des restrictions sur les actions
    switch (resource) {
      case 'users':
        return true; // Tous peuvent voir la liste des utilisateurs
      case 'entreprise':
        return isAdmin();
      case 'parametres':
        return isAdmin();
      case 'reports':
        return isAdmin() || isManager() || isComptable();
      case 'articles':
        return true; // Tous peuvent voir les articles
      case 'clients':
        return true; // Tous peuvent voir les clients
      case 'fournisseurs':
        return true; // Tous peuvent voir les fournisseurs
      case 'commandes':
        return true; // Tous peuvent voir les commandes
      case 'mouvements-stock':
        return true; // Tous peuvent voir les mouvements
      case 'ventes':
        return true; // Tous peuvent voir les ventes
      case 'statistiques-globales':
        return isAdmin() || isManager();
      case 'statistiques-financieres':
        return isAdmin() || isComptable();
      case 'gestion-equipe':
        return isAdmin() || isManager();
      default:
        return true; // Par défaut, accès autorisé (comme dans Angular)
    }
  };
  
  const canEdit = (resource: string): boolean => {
    switch (resource) {
      case 'users':
        return isAdmin();
      case 'entreprise':
        return isAdmin();
      case 'articles':
        return isAdmin() || isManager();
      case 'clients':
        return isAdmin() || isManager() || isVendeur();
      case 'fournisseurs':
        return isAdmin() || isManager();
      case 'commandes':
        return isAdmin() || isManager() || isVendeur();
      case 'categories':
        return isAdmin() || isManager();
      default:
        return false;
    }
  };
  
  const canDelete = (resource: string): boolean => {
    switch (resource) {
      case 'users':
        return isAdmin();
      case 'articles':
        return isAdmin();
      case 'clients':
        return isAdmin() || isManager();
      case 'fournisseurs':
        return isAdmin();
      case 'commandes':
        return isAdmin() || isManager();
      case 'categories':
        return isAdmin();
      default:
        return false;
    }
  };
  
  const getUserRole = (): string => {
    console.log('getUserRole - user:', user);
    console.log('getUserRole - user.roles:', user?.roles);
    if (isAdmin()) return 'ADMIN';
    if (isManager()) return 'MANAGER';
    if (isComptable()) return 'COMPTABLE';
    if (isVendeur()) return 'VENDEUR';
    if (isUser()) return 'USER';
    return 'UNKNOWN';
  };
  
  const getRoleDisplayName = (): string => {
    switch (getUserRole()) {
      case 'ADMIN': return 'Administrateur';
      case 'MANAGER': return 'Gestionnaire';
      case 'COMPTABLE': return 'Comptable';
      case 'VENDEUR': return 'Vendeur';
      case 'USER': return 'Utilisateur';
      default: return 'Non défini';
    }
  };
  
  return {
    hasRole,
    isAdmin,
    isUser,
    isManager,
    isComptable,
    isVendeur,
    canAccess,
    canEdit,
    canDelete,
    getUserRole,
    getRoleDisplayName,
    user
  };
};
