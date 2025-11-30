import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Save, Lock, AdminPanelSettings } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveUtilisateur } from '../store/slices/utilisateurSlice';
import { UtilisateurDto } from '../types';
import { useRoles } from '../hooks/useRoles';

const Profil: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.utilisateurs);
  const { getRoleDisplayName, getUserRole } = useRoles();

  const [formData, setFormData] = useState<UtilisateurDto>({
    nom: '', prenom: '', email: '', dateDeNaissance: '',
    adresse: { adresse1: '', ville: '', codePostale: '', pays: '' }
  });

  useEffect(() => {
    if (user) {
      console.log('Profil - Utilisateur connecté:', user);
      console.log('Profil - Rôles de l\'utilisateur:', user.roles);
      console.log('Profil - Rôle affiché:', getRoleDisplayName());
      
      setFormData({
        ...user,
        moteDePasse: undefined // Ne pas afficher le mot de passe
      });
    }
  }, [user, getRoleDisplayName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('adresse.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, adresse: { ...prev.adresse, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(saveUtilisateur(formData)).unwrap();
      // Optionnel: mettre à jour l'utilisateur connecté
    } catch (error) {}
  };

  const getUserInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">Mon Profil</Typography>
        <Button variant="outlined" startIcon={<Lock />} onClick={() => navigate('/changermotdepasse')}>
          Changer le mot de passe
        </Button>
      </Box>

      <Card className="form-container">
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Avatar et informations de base */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}
              src={user?.photo}
            >
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {user?.prenom} {user?.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email}
              </Typography>
              <Chip 
                icon={<AdminPanelSettings />}
                label={getRoleDisplayName()}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Informations personnelles</Typography></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Prénom" name="prenom" value={formData.prenom || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nom" name="nom" value={formData.nom || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Date de naissance" name="dateDeNaissance" type="date" value={formData.dateDeNaissance || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
              
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Adresse</Typography></Grid>
              <Grid item xs={12}><TextField fullWidth label="Adresse" name="adresse.adresse1" value={formData.adresse?.adresse1 || ''} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Ville" name="adresse.ville" value={formData.adresse?.ville || ''} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Code Postal" name="adresse.codePostale" value={formData.adresse?.codePostale || ''} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Pays" name="adresse.pays" value={formData.adresse?.pays || ''} onChange={handleChange} /></Grid>
            </Grid>

            <Box className="form-actions">
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                {loading ? 'Enregistrement...' : 'Mettre à jour le profil'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profil;
