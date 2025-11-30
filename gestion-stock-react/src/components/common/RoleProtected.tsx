import React from 'react';
import { useRoles } from '../../hooks/useRoles';

interface RoleProtectedProps {
  roles?: string[];
  resource?: string;
  action?: 'view' | 'edit' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleProtected: React.FC<RoleProtectedProps> = ({ 
  roles, 
  resource,
  action = 'view',
  children, 
  fallback = null 
}) => {
  const { hasRole, canAccess, canEdit, canDelete } = useRoles();
  
  let hasPermission = false;
  
  // Vérification par rôles spécifiques
  if (roles && roles.length > 0) {
    hasPermission = roles.some(role => hasRole(role));
  }
  // Vérification par ressource et action
  else if (resource) {
    switch (action) {
      case 'view':
        hasPermission = canAccess(resource);
        break;
      case 'edit':
        hasPermission = canEdit(resource);
        break;
      case 'delete':
        hasPermission = canDelete(resource);
        break;
      default:
        hasPermission = canAccess(resource);
    }
  }
  // Si aucun critère spécifié, autoriser par défaut
  else {
    hasPermission = true;
  }
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default RoleProtected;
