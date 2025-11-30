import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { hasAccess } from '../../utils/roleUtils';
import { Box, Typography, Alert } from '@mui/material';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
  redirectTo?: string;
  showAccessDenied?: boolean;
}

/**
 * Composant de protection des routes basé sur les rôles
 * Basé sur la logique du projet Angular de référence
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/',
  showAccessDenied = false,
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier les permissions d'accès
  const userHasAccess = hasAccess(user, requiredRoles);

  if (!userHasAccess) {
    if (showAccessDenied) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Accès refusé
            </Typography>
            <Typography>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              Rôles requis : {requiredRoles.join(', ')}
            </Typography>
          </Alert>
        </Box>
      );
    }
    
    // Redirection vers la page spécifiée
    return <Navigate to={redirectTo} replace />;
  }

  // L'utilisateur a accès, afficher le contenu
  return <>{children}</>;
};

export default RoleProtectedRoute;
