import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { entrepriseService } from '../services/entrepriseService';
import { useAppDispatch } from '../hooks/redux';
import { login, getUserByEmail } from '../store/slices/authSlice';
import { EntrepriseDto, AdresseDto, AuthenticationRequest, UtilisateurDto } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [entrepriseDto, setEntrepriseDto] = useState<EntrepriseDto>({
    nom: '',
    codeFiscal: '',
    email: '',
    description: '',
    numTel: '',
  });
  
  const [adresse, setAdresse] = useState<AdresseDto>({
    adresse1: '',
    adresse2: '',
    ville: '',
    codePostale: '',
    pays: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorsMsg, setErrorsMsg] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleEntrepriseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntrepriseDto(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdresseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdresse(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const inscrire = async () => {
    setErrorsMsg([]);
    setLoading(true);

    try {
      // Associer l'adresse à l'entreprise
      const entrepriseToSave = {
        ...entrepriseDto,
        adresse: adresse
      };

      // Inscription de l'entreprise
      const savedEntreprise = await entrepriseService.sinscrire(entrepriseToSave);
      
      // Connexion automatique après inscription
      await connectEntreprise();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrorsMsg(error.response.data.errors);
      } else {
        setErrorsMsg([error.response?.data?.message || 'Erreur lors de l\'inscription']);
      }
    } finally {
      setLoading(false);
    }
  };

  const connectEntreprise = async () => {
    try {
      console.log('🔄 Début connexion automatique après inscription');
      
      const authenticationRequest: AuthenticationRequest = {
        login: entrepriseDto.email,
        password: 'som3R@nd0mP@$$word' // Mot de passe temporaire comme dans Angular
      };

      // Utiliser le store Redux pour la connexion
      console.log('🔐 Tentative de connexion avec:', authenticationRequest.login);
      const result = await dispatch(login(authenticationRequest)).unwrap();
      console.log('✅ Connexion réussie, token reçu');
      
      // Attendre un peu pour que les rôles soient bien sauvegardés
      console.log('⏳ Attente de 2 secondes pour la sauvegarde des rôles...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Récupérer les informations de l'utilisateur après la connexion
      if (entrepriseDto.email) {
        console.log('👤 Récupération des données utilisateur...');
        const userResult = await dispatch(getUserByEmail(entrepriseDto.email));
        const userData = userResult.payload as UtilisateurDto;
        console.log('📋 Utilisateur récupéré après inscription:', userData);
        console.log('🎭 Rôles de l\'utilisateur:', userData?.roles);
        
        if (!userData?.roles || userData.roles.length === 0) {
          console.warn('⚠️ ATTENTION: Aucun rôle trouvé pour l\'utilisateur !');
          // Essayer une deuxième fois après un délai supplémentaire
          console.log('🔄 Nouvelle tentative de récupération des rôles...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResult = await dispatch(getUserByEmail(entrepriseDto.email));
          const retryUserData = retryResult.payload as UtilisateurDto;
          console.log('🔄 Deuxième tentative - Rôles:', retryUserData?.roles);
        }
      }
      
      // Stocker l'origine de l'inscription et rediriger vers changement de mot de passe
      localStorage.setItem('origin', 'inscription');
      console.log('🏁 Redirection vers changement de mot de passe');
      navigate('/changermotdepasse');
    } catch (error) {
      console.error('Erreur lors de la connexion automatique:', error);
      // En cas d'erreur, rediriger vers login
      navigate('/login');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 500,
          }}
        >
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            py: 2, 
            borderBottom: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa'
          }}>
            <Typography variant="h5" component="h3">
              S'inscrire
            </Typography>
          </Box>

          {/* Body */}
          <Box sx={{ p: 3 }}>
            {/* Messages d'erreur */}
            {errorsMsg.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorsMsg.map((msg, index) => (
                  <Box key={index}>{msg}</Box>
                ))}
              </Alert>
            )}

            {/* Formulaire */}
            <Box component="form">
              {/* Nom de l'entreprise */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Nom"
                  name="nom"
                  value={entrepriseDto.nom || ''}
                  onChange={handleEntrepriseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Code fiscal */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Code fiscal"
                  name="codeFiscal"
                  value={entrepriseDto.codeFiscal || ''}
                  onChange={handleEntrepriseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Email */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="E-mail"
                  name="email"
                  type="email"
                  value={entrepriseDto.email || ''}
                  onChange={handleEntrepriseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Adresse 1 */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Adresse 1"
                  name="adresse1"
                  value={adresse.adresse1 || ''}
                  onChange={handleAdresseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Adresse 2 */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Adresse 2"
                  name="adresse2"
                  value={adresse.adresse2 || ''}
                  onChange={handleAdresseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Ville */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Ville"
                  name="ville"
                  value={adresse.ville || ''}
                  onChange={handleAdresseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Code postal */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Code postal"
                  name="codePostale"
                  value={adresse.codePostale || ''}
                  onChange={handleAdresseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Pays */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Pays"
                  name="pays"
                  value={adresse.pays || ''}
                  onChange={handleAdresseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={entrepriseDto.description || ''}
                  onChange={handleEntrepriseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Numéro de téléphone */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Numero de telephone"
                  name="numTel"
                  value={entrepriseDto.numTel || ''}
                  onChange={handleEntrepriseChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Boutons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3 
              }}>
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none',
                    color: '#007bff'
                  }}
                >
                  Se connecter
                </Link>
                
                <Button
                  variant="contained"
                  onClick={inscrire}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : <Check />}
                  sx={{
                    backgroundColor: '#007bff',
                    '&:hover': {
                      backgroundColor: '#0056b3'
                    }
                  }}
                >
                  {loading ? 'Inscription...' : "S'inscrire"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
