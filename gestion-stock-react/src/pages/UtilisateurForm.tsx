import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Save, Cancel, ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveUtilisateur, fetchUtilisateurById } from '../store/slices/utilisateurSlice';
import { getUserByEmail } from '../store/slices/authSlice';
import { UtilisateurDto, RoleDto } from '../types';

const UtilisateurForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.utilisateurs);
  const isEdit = !!id;
  const [errorMsg, setErrorMsg] = useState<string[]>([]);

  const [formData, setFormData] = useState<UtilisateurDto>({
    nom: '',
    prenom: '',
    email: '',
    moteDePasse: '',
    numTel: '',
    dateDeNaissance: '',
    photo: '',
    adresse: {
      adresse1: '',
      ville: '',
      codePostale: '',
      pays: 'France'
    }
  });
  
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedRole, setSelectedRole] = useState<string>('USER');

  // Rôles disponibles selon les permissions
  const availableRoles = [
    { value: 'USER', label: 'Utilisateur', description: 'Accès lecture aux articles et tableau de bord' },
    { value: 'MANAGER', label: 'Gestionnaire', description: 'Gestion complète articles, clients, fournisseurs, stock' },
    { value: 'ADMIN', label: 'Administrateur', description: 'Accès complet + gestion utilisateurs et paramètres' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchUtilisateurById(parseInt(id)));
    }
  }, [dispatch, id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('adresse.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, adresse: { ...prev.adresse, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmerMotDePasse(e.target.value);
    if (errors.confirmerMotDePasse) {
      setErrors(prev => ({ ...prev, confirmerMotDePasse: '' }));
    }
  };

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }
    if (!formData.prenom?.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    }
    if (!isEdit && !formData.moteDePasse) {
      newErrors.moteDePasse = 'Le mot de passe est obligatoire';
    }
    if (!isEdit && formData.moteDePasse !== confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Vérifier si l'utilisateur connecté a une entreprise
      if (!user?.entreprise) {
        console.warn('Aucune entreprise trouvée pour l\'utilisateur connecté. Récupération des données...');
        await dispatch(getUserByEmail(user?.email || ''));
      }
      
      if (!user?.entreprise) {
        setErrors({ general: 'Erreur: Aucune entreprise associée à votre compte.' });
        return;
      }

      // Préparer les données utilisateur selon le format backend
      const utilisateurData: UtilisateurDto = {
        ...formData,
        entreprise: user.entreprise,
        // Convertir la date de naissance en format ISO si elle existe
        dateDeNaissance: formData.dateDeNaissance ? new Date(formData.dateDeNaissance).toISOString() : undefined,
        // Ajouter le rôle sélectionné
        roles: [{
          id: undefined,
          roleName: selectedRole
        } as RoleDto]
      };

      // Pour la modification, ne pas envoyer le mot de passe s'il est vide
      if (isEdit && !formData.moteDePasse) {
        delete utilisateurData.moteDePasse;
      }

      console.log('🚀 FRONTEND: Envoi des données au backend');
      console.log('📋 FRONTEND: Utilisateur à créer:', utilisateurData);
      console.log('🎭 FRONTEND: Rôles inclus:', utilisateurData.roles);
      console.log('🏢 FRONTEND: Entreprise:', utilisateurData.entreprise);
      
      const result = await dispatch(saveUtilisateur(utilisateurData)).unwrap();
      console.log('✅ FRONTEND: Utilisateur créé avec succès:', result);
      navigate('/utilisateurs');
      
    } catch (error: any) {
      console.error('❌ FRONTEND: Erreur lors de la sauvegarde:', error);
      console.error('📊 FRONTEND: Status de l\'erreur:', error.response?.status);
      console.error('📝 FRONTEND: Message d\'erreur:', error.response?.data);
      setErrors({ 
        general: error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde de l\'utilisateur' 
      });
    }
  };



  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">{id ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}</Typography>
      </Box>
      <Card className="form-container">
        <CardContent>
          {(error || errorMsg.length > 0 || errors.general) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general || error || errorMsg.join(', ')}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Informations personnelles</Typography></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nom *" name="nom" value={formData.nom || ''} onChange={handleChange} error={!!errors.nom} helperText={errors.nom} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Prénom *" name="prenom" value={formData.prenom || ''} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Email *" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={!!errors.email} helperText={errors.email} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Téléphone" name="numTel" value={formData.numTel || ''} onChange={handleChange} /></Grid>
              {!isEdit && (
                <>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Mot de passe *" name="moteDePasse" type="password" value={formData.moteDePasse || ''} onChange={handleChange} error={!!errors.moteDePasse} helperText={errors.moteDePasse} required /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Confirmer mot de passe *" name="confirmerMotDePasse" type="password" value={confirmerMotDePasse} onChange={handleConfirmPasswordChange} error={!!errors.confirmerMotDePasse} helperText={errors.confirmerMotDePasse} required /></Grid>
                </>
              )}
              <Grid item xs={12} md={6}><TextField fullWidth label="Date de naissance" name="dateDeNaissance" type="date" value={formData.dateDeNaissance ? formData.dateDeNaissance.split('T')[0] : ''} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Photo (URL)" name="photo" value={formData.photo || ''} onChange={handleChange} /></Grid>
              
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Permissions et Rôle</Typography></Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rôle de l'utilisateur *</InputLabel>
                  <Select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    label="Rôle de l'utilisateur *"
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {role.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rôle sélectionné :
                  </Typography>
                  <Chip 
                    label={availableRoles.find(r => r.value === selectedRole)?.label} 
                    color={selectedRole === 'ADMIN' ? 'error' : selectedRole === 'MANAGER' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Adresse</Typography></Grid>
              <Grid item xs={12}><TextField fullWidth label="Adresse" name="adresse.adresse1" value={formData.adresse?.adresse1 || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Ville" name="adresse.ville" value={formData.adresse?.ville || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Code Postal" name="adresse.codePostale" value={formData.adresse?.codePostale || ''} onChange={handleChange} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Pays" name="adresse.pays" value={formData.adresse?.pays || ''} onChange={handleChange} required /></Grid>
            </Grid>
            <Box className="form-actions">
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/utilisateurs')} disabled={loading}>Annuler</Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UtilisateurForm;
