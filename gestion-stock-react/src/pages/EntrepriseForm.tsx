import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Save, Cancel, Business } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveEntreprise, fetchEntrepriseById, setCurrentEntreprise } from '../store/slices/entrepriseSlice';
import { EntrepriseDto } from '../types';
import ImageUpload from '../components/common/ImageUpload';

const EntrepriseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentEntreprise, loading, error } = useAppSelector((state) => state.entreprises);

  const [formData, setFormData] = useState<EntrepriseDto>({
    nom: '',
    description: '',
    codeFiscal: '',
    email: '',
    numTel: '',
    steWeb: '',
    photo: '',
    adresse: {
      adresse1: '',
      adresse2: '',
      ville: '',
      codePostale: '',
      pays: 'France',
    },
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      // Mode édition
      dispatch(fetchEntrepriseById(parseInt(id)));
    } else {
      // Mode création
      dispatch(setCurrentEntreprise(null));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentEntreprise && id) {
      setFormData({
        ...currentEntreprise,
        adresse: currentEntreprise.adresse || {
          adresse1: '',
          adresse2: '',
          ville: '',
          codePostale: '',
          pays: 'France',
        },
      });
    }
  }, [currentEntreprise, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('adresse.')) {
      const adresseField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse!,
          [adresseField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Effacer l'erreur de validation si elle existe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, photo: imageUrl }));
  };

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: { [key: string]: string } = {};
    
    if (!formData.nom?.trim()) {
      errors.nom = 'Le nom de l\'entreprise est requis';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.codeFiscal?.trim()) {
      errors.codeFiscal = 'Le code fiscal est requis';
    }

    if (!formData.adresse?.adresse1?.trim()) {
      errors['adresse.adresse1'] = 'L\'adresse est requise';
    }

    if (!formData.adresse?.ville?.trim()) {
      errors['adresse.ville'] = 'La ville est requise';
    }

    if (!formData.adresse?.codePostale?.trim()) {
      errors['adresse.codePostale'] = 'Le code postal est requis';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const savedEntreprise = await dispatch(saveEntreprise(formData)).unwrap();
      
      // Si on a un fichier sélectionné et une entreprise sauvegardée, uploader la photo
      if (selectedFile && savedEntreprise.id && savedEntreprise.nom) {
        console.log('Photo sera uploadée pour l\'entreprise:', savedEntreprise.id);
      }
      
      navigate('/entreprises');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/entreprises');
  };

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
          {id ? 'Modifier l\'Entreprise' : 'Nouvelle Entreprise'}
        </Typography>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulaire */}
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Informations de base */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Informations de l'entreprise
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom de l'entreprise"
                  name="nom"
                  value={formData.nom || ''}
                  onChange={handleChange}
                  error={!!validationErrors.nom}
                  helperText={validationErrors.nom}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Code Fiscal"
                  name="codeFiscal"
                  value={formData.codeFiscal || ''}
                  onChange={handleChange}
                  error={!!validationErrors.codeFiscal}
                  helperText={validationErrors.codeFiscal}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Informations de contact
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="numTel"
                  value={formData.numTel || ''}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Web"
                  name="steWeb"
                  value={formData.steWeb || ''}
                  onChange={handleChange}
                  placeholder="https://www.monentreprise.com"
                />
              </Grid>

              {/* Adresse */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Adresse
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  name="adresse.adresse1"
                  value={formData.adresse?.adresse1 || ''}
                  onChange={handleChange}
                  error={!!validationErrors['adresse.adresse1']}
                  helperText={validationErrors['adresse.adresse1']}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Complément d'adresse"
                  name="adresse.adresse2"
                  value={formData.adresse?.adresse2 || ''}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ville"
                  name="adresse.ville"
                  value={formData.adresse?.ville || ''}
                  onChange={handleChange}
                  error={!!validationErrors['adresse.ville']}
                  helperText={validationErrors['adresse.ville']}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  name="adresse.codePostale"
                  value={formData.adresse?.codePostale || ''}
                  onChange={handleChange}
                  error={!!validationErrors['adresse.codePostale']}
                  helperText={validationErrors['adresse.codePostale']}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Pays"
                  name="adresse.pays"
                  value={formData.adresse?.pays || 'France'}
                  onChange={handleChange}
                />
              </Grid>

              {/* Section Photo */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Logo de l'entreprise
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <ImageUpload
                  currentImage={formData.photo}
                  onImageChange={handleImageChange}
                  onImageUpload={handleImageUpload}
                  context="entreprise"
                  entityId={formData.id}
                  entityTitle={formData.nom}
                  size="medium"
                  shape="square"
                />
              </Grid>

              {/* Boutons d'action */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EntrepriseForm;
