import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Save, Cancel, ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUtilisateurById } from '../store/slices/utilisateurSlice';
import { utilisateurService } from '../services/utilisateurService';
import { UtilisateurDto, RoleDto } from '../types';
import { getPrincipalRole } from '../utils/roleUtils';

const UtilisateurEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentUtilisateur, loading } = useAppSelector((state) => state.utilisateurs);
  
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
  
  const [selectedRole, setSelectedRole] = useState<string>('USER');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rôles disponibles selon les permissions
  const availableRoles = [
    { value: 'USER', label: 'Utilisateur', description: 'Accès lecture aux articles et tableau de bord' },
    { value: 'MANAGER', label: 'Gestionnaire', description: 'Gestion complète articles, clients, fournisseurs, stock' },
    { value: 'ADMIN', label: 'Administrateur', description: 'Accès complet + gestion utilisateurs et paramètres' }
  ];

  // Charger les données de l'utilisateur à modifier
  useEffect(() => {
    if (id) {
      dispatch(fetchUtilisateurById(parseInt(id)));
    }
  }, [dispatch, id]);

  // Mettre à jour le formulaire quand les données sont chargées
  useEffect(() => {
    if (currentUtilisateur) {
      setFormData({
        ...currentUtilisateur,
        moteDePasse: '', // Ne pas pré-remplir le mot de passe
      });
      
      // Mettre à jour le rôle sélectionné
      if (currentUtilisateur.roles && currentUtilisateur.roles.length > 0) {
        setSelectedRole(currentUtilisateur.roles[0].roleName || 'USER');
      }
    }
  }, [currentUtilisateur]);

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
    if (!formData.adresse?.adresse1?.trim()) {
      newErrors['adresse.adresse1'] = 'L\'adresse est obligatoire';
    }
    if (!formData.adresse?.ville?.trim()) {
      newErrors['adresse.ville'] = 'La ville est obligatoire';
    }
    if (!formData.adresse?.codePostale?.trim()) {
      newErrors['adresse.codePostale'] = 'Le code postal est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      if (!user?.entreprise) {
        setErrors({ general: 'Erreur: Aucune entreprise associée à votre compte.' });
        return;
      }

      // Préparer les données utilisateur pour la modification
      const utilisateurData: UtilisateurDto = {
        ...formData,
        id: currentUtilisateur?.id, // Important: inclure l'ID pour la modification
        entreprise: user.entreprise,
        // Convertir la date de naissance en format ISO si elle existe
        dateDeNaissance: formData.dateDeNaissance ? new Date(formData.dateDeNaissance).toISOString() : undefined,
        // Ajouter le rôle sélectionné
        roles: [{
          id: undefined,
          roleName: selectedRole
        } as RoleDto]
      };

      // Vérification des données avant envoi
      console.log('Données complètes avant traitement:', {
        ...utilisateurData,
        adresse: utilisateurData.adresse
      });

      // Si le mot de passe est vide, ne pas l'inclure dans les données
      if (!formData.moteDePasse || formData.moteDePasse.trim() === '') {
        // Ne pas inclure le mot de passe dans les données envoyées
        const { moteDePasse, ...dataWithoutPassword } = utilisateurData;
        console.log('Données envoyées pour modification (sans mot de passe):', dataWithoutPassword);
        await utilisateurService.save(dataWithoutPassword);
      } else {
        // Inclure le nouveau mot de passe
        console.log('Données envoyées pour modification (avec nouveau mot de passe):', utilisateurData);
        await utilisateurService.save(utilisateurData);
      }
      
      navigate('/utilisateurs');
      
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      setErrors({ 
        general: error.response?.data?.message || error.message || 'Erreur lors de la modification de l\'utilisateur' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Chargement des données utilisateur...</Typography>
      </Box>
    );
  }

  if (!currentUtilisateur) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Utilisateur non trouvé ou erreur lors du chargement.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Modifier l'Utilisateur
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/utilisateurs')}
        >
          Retour à la liste
        </Button>
      </Box>

      <Card className="form-container">
        <CardContent>
          {(errors.general) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Informations personnelles</Typography></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nom *" name="nom" value={formData.nom || ''} onChange={handleChange} error={!!errors.nom} helperText={errors.nom} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Prénom *" name="prenom" value={formData.prenom || ''} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Email *" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={!!errors.email} helperText={errors.email} required /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Téléphone" name="numTel" value={formData.numTel || ''} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nouveau mot de passe" name="moteDePasse" type="password" value={formData.moteDePasse || ''} onChange={handleChange} helperText="Laissez vide pour conserver le mot de passe actuel" /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Date de naissance" name="dateDeNaissance" type="date" value={formData.dateDeNaissance ? formData.dateDeNaissance.split('T')[0] : ''} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Photo (URL)" name="photo" value={formData.photo || ''} onChange={handleChange} /></Grid>
              
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
              <Grid item xs={12}><TextField fullWidth label="Adresse *" name="adresse.adresse1" value={formData.adresse?.adresse1 || ''} onChange={handleChange} error={!!errors['adresse.adresse1']} helperText={errors['adresse.adresse1']} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Ville *" name="adresse.ville" value={formData.adresse?.ville || ''} onChange={handleChange} error={!!errors['adresse.ville']} helperText={errors['adresse.ville']} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Code Postal *" name="adresse.codePostale" value={formData.adresse?.codePostale || ''} onChange={handleChange} error={!!errors['adresse.codePostale']} helperText={errors['adresse.codePostale']} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Pays" name="adresse.pays" value={formData.adresse?.pays || ''} onChange={handleChange} required /></Grid>
            </Grid>
            
            <Box className="form-actions">
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/utilisateurs')} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={isSubmitting}>
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UtilisateurEdit;
