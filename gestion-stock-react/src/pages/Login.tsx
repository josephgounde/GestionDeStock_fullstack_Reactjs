import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, getUserByEmail, clearError } from '../store/slices/authSlice';
import { AuthenticationRequest } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<AuthenticationRequest>({
    login: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.login || !formData.password) {
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      
      // Récupérer les informations de l'utilisateur
      if (formData.login) {
        await dispatch(getUserByEmail(formData.login));
      }
      
      navigate('/');
    } catch (error) {
      // L'erreur est déjà gérée par le slice
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
          {/* Header - Style Angular */}
          <Box sx={{ 
            textAlign: 'center', 
            py: 2, 
            borderBottom: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa'
          }}>
            <Typography variant="h5" component="h3">
              Se connecter
            </Typography>
          </Box>

          {/* Body - Style Angular */}
          <Box sx={{ p: 3 }}>
            {/* Message d'erreur */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Formulaire */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Email */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="E-mail"
                  name="login"
                  type="email"
                  value={formData.login || ''}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={loading}
                  autoFocus
                />
              </Box>

              {/* Mot de passe */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Mot de passe"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              {/* Boutons - Style Angular */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3 
              }}>
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: '#007bff'
                  }}
                >
                  S'inscrire
                </Link>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !formData.login || !formData.password}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                  sx={{
                    backgroundColor: '#007bff',
                    '&:hover': {
                      backgroundColor: '#0056b3'
                    }
                  }}
                >
                  {loading ? 'Connexion...' : (
                    <>
                      <i className="fas fa-check" style={{ marginRight: '8px' }} />
                      Se connecter
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
