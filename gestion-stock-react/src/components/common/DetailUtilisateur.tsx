import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  LocationOn,
  Phone,
  Badge,
  AdminPanelSettings,
} from '@mui/icons-material';
import { UtilisateurDto } from '../../types';

interface DetailUtilisateurProps {
  utilisateur: UtilisateurDto;
  showActions?: boolean;
  compact?: boolean;
  showSensitiveInfo?: boolean;
}

const DetailUtilisateur: React.FC<DetailUtilisateurProps> = ({ 
  utilisateur, 
  showActions = false, 
  compact = false,
  showSensitiveInfo = true 
}) => {
  const getUserInitials = () => {
    if (utilisateur.prenom && utilisateur.nom) {
      return `${utilisateur.prenom.charAt(0)}${utilisateur.nom.charAt(0)}`.toUpperCase();
    }
    return utilisateur.email?.charAt(0).toUpperCase() || 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getFullAddress = () => {
    if (!utilisateur.adresse) return null;
    
    const parts = [
      utilisateur.adresse.adresse1,
      utilisateur.adresse.codePostale && utilisateur.adresse.ville 
        ? `${utilisateur.adresse.codePostale} ${utilisateur.adresse.ville}`
        : utilisateur.adresse.ville,
      utilisateur.adresse.pays
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const getUserRoles = () => {
    if (!utilisateur.roles || utilisateur.roles.length === 0) {
      return ['USER']; // Rôle par défaut si aucun rôle spécifié
    }
    return utilisateur.roles.map(role => role.roleName || 'UNKNOWN');
  };

  const getRoleDisplayName = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN': return 'Administrateur';
      case 'MANAGER': return 'Gestionnaire';
      case 'COMPTABLE': return 'Comptable';
      case 'VENDEUR': return 'Vendeur';
      case 'USER': return 'Utilisateur';
      default: return roleName;
    }
  };

  const getRoleColor = (roleName: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (roleName) {
      case 'ADMIN': return 'error';
      case 'MANAGER': return 'warning';
      case 'COMPTABLE': return 'info';
      case 'VENDEUR': return 'success';
      case 'USER': return 'primary';
      default: return 'default';
    }
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {getUserInitials()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            {utilisateur.prenom} {utilisateur.nom}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {utilisateur.email}
          </Typography>
        </Box>
        <Chip label="Utilisateur" color="primary" size="small" />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* En-tête utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {utilisateur.prenom} {utilisateur.nom}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Badge color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Utilisateur du système
              </Typography>
            </Box>
            <Chip 
              label={utilisateur.id ? `ID: ${utilisateur.id}` : 'Nouvel utilisateur'} 
              color="primary" 
              size="small" 
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Informations personnelles */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person />
          Informations Personnelles
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Email color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">Email:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {utilisateur.email || 'Non renseigné'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">Date de naissance:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(utilisateur.dateDeNaissance)}
              </Typography>
            </Box>
          </Grid>

          {utilisateur.numTel && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Phone color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">Téléphone:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {utilisateur.numTel}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Adresse */}
        {getFullAddress() && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn />
              Adresse
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2">
                {getFullAddress()}
              </Typography>
            </Box>
          </>
        )}

        {/* Permissions et informations système */}
        {showSensitiveInfo && (
          <>
            <Divider sx={{ mb: 2 }} />
            
            {/* Section Permissions */}
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminPanelSettings />
              Permissions et Rôles
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Rôles attribués:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {getUserRoles().map((roleName, index) => (
                  <Chip
                    key={index}
                    icon={<AdminPanelSettings />}
                    label={getRoleDisplayName(roleName)}
                    color={getRoleColor(roleName)}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Les rôles déterminent les permissions d'accès aux différentes fonctionnalités du système.
              </Typography>
            </Box>

            {/* Section Informations système */}
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.contrastText">
                <strong>Informations système:</strong>
              </Typography>
              <Typography variant="caption" color="info.contrastText" sx={{ display: 'block', mt: 1 }}>
                • Compte créé: {utilisateur.id ? 'Oui' : 'En cours de création'}
              </Typography>
              <Typography variant="caption" color="info.contrastText" sx={{ display: 'block' }}>
                • Statut: Actif
              </Typography>
              {utilisateur.moteDePasse && (
                <Typography variant="caption" color="info.contrastText" sx={{ display: 'block' }}>
                  • Mot de passe: Configuré
                </Typography>
              )}
              <Typography variant="caption" color="info.contrastText" sx={{ display: 'block' }}>
                • Entreprise: {utilisateur.entreprise?.nom || 'Non associée'}
              </Typography>
            </Box>
          </>
        )}

        {/* Actions (si activées) */}
        {showActions && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {/* Les actions peuvent être ajoutées ici selon les besoins */}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailUtilisateur;
