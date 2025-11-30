import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, InputAdornment, IconButton } from '@mui/material';
import { Save, Cancel, Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changePassword } from '../store/slices/authSlice';

const ChangerMotDePasse: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    motDePasse: '',
    confirmMotDePasse: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.motDePasse) {
      errors.motDePasse = 'Le nouveau mot de passe est obligatoire';
    } else if (formData.motDePasse.length < 6) {
      errors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmMotDePasse) {
      errors.confirmMotDePasse = 'La confirmation du mot de passe est obligatoire';
    } else if (formData.motDePasse !== formData.confirmMotDePasse) {
      errors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('User from Redux:', user);
    console.log('User ID:', user?.id);

    if (!user?.id) {
      console.error('Aucun utilisateur connecté ou ID manquant');
      setValidationErrors({ motDePasse: 'Erreur: utilisateur non identifié. Veuillez vous reconnecter.' });
      return;
    }

    try {
      console.log('Tentative de changement de mot de passe pour l\'utilisateur:', user.id);
      await dispatch(changePassword({
        id: user.id,
        motDePasse: formData.motDePasse,
        confirmMotDePasse: formData.confirmMotDePasse
      })).unwrap();
      
      console.log('Changement de mot de passe réussi');
      // Rediriger vers le dashboard au lieu du profil
      navigate('/');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      // L'erreur est gérée par le slice
    }
  };

  const handleCancel = () => {
    navigate('/profil');
  };

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Changer le mot de passe
        </Typography>
      </Box>

      <Card className="form-container" sx={{ maxWidth: 500 }}>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Nouveau mot de passe
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  name="motDePasse"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.motDePasse}
                  onChange={handleChange}
                  error={!!validationErrors.motDePasse}
                  helperText={validationErrors.motDePasse}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmer le nouveau mot de passe"
                  name="confirmMotDePasse"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  error={!!validationErrors.confirmMotDePasse}
                  helperText={validationErrors.confirmMotDePasse}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box className="form-actions">
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangerMotDePasse;
