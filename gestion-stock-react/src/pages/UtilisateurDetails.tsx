import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Person,
  Security,
  Assessment,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUtilisateurById } from '../store/slices/utilisateurSlice';
import DetailUtilisateur from '../components/common/DetailUtilisateur';

const UtilisateurDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUtilisateur, loading, error } = useAppSelector((state) => state.utilisateurs);

  useEffect(() => {
    if (id) {
      const utilisateurId = parseInt(id);
      dispatch(fetchUtilisateurById(utilisateurId));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentUtilisateur) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Utilisateur non trouvé'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/utilisateurs')}>
          Retour aux utilisateurs
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/utilisateurs')}>
            Retour
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Détails de l'Utilisateur
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/nouvelutilisateur/${currentUtilisateur.id}`)}
        >
          Modifier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <DetailUtilisateur 
            utilisateur={currentUtilisateur} 
            showSensitiveInfo={true}
            compact={false}
          />
        </Grid>

        {/* Panneau d'actions et statistiques */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Actions rapides */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security />
                    Actions Sécurité
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/changermotdepasse')}
                      disabled={!currentUtilisateur.id}
                    >
                      Réinitialiser le mot de passe
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      fullWidth
                      disabled
                    >
                      Suspendre le compte
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Statistiques utilisateur */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment />
                    Statistiques
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {currentUtilisateur.id ? 'Actif' : 'Nouveau'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Statut du compte
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Informations du compte:
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      • ID: {currentUtilisateur.id || 'Non assigné'}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      • Email: {currentUtilisateur.email ? 'Configuré' : 'Non configuré'}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      • Profil: {currentUtilisateur.prenom && currentUtilisateur.nom ? 'Complet' : 'Incomplet'}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      • Adresse: {currentUtilisateur.adresse?.adresse1 ? 'Configurée' : 'Non configurée'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Informations système */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    Informations Système
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.contrastText" gutterBottom>
                      <strong>Dernière activité:</strong>
                    </Typography>
                    <Typography variant="caption" color="info.contrastText">
                      Informations non disponibles
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="success.contrastText" gutterBottom>
                      <strong>Permissions:</strong>
                    </Typography>
                    <Typography variant="caption" color="success.contrastText">
                      Utilisateur standard
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UtilisateurDetails;
