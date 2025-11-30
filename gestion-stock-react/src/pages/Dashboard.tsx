import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Inventory,
  People,
  Business,
  ShoppingCart,
  TrendingUp,
  Category,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchArticles } from '../store/slices/articleSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchClients } from '../store/slices/clientSlice';
import { fetchFournisseurs } from '../store/slices/fournisseurSlice';
import { fetchCommandesClient, fetchCommandesFournisseur } from '../store/slices/commandeSlice';
import { getPrincipalRole } from '../utils/roleUtils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading = false }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: `${color}.main`, mb: 1 }}>
          {loading ? <CircularProgress size={32} /> : value.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { articles, loading: articlesLoading } = useAppSelector((state) => state.articles);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { clients, loading: clientsLoading } = useAppSelector((state) => state.clients);
  const { fournisseurs, loading: fournisseursLoading } = useAppSelector((state) => state.fournisseurs);
  const { commandesClient, commandesFournisseur, loading: commandesLoading } = useAppSelector((state) => state.commandes);

  const [error, setError] = useState<string | null>(null);

  // Obtenir le rôle principal de l'utilisateur (avec USER par défaut comme dans Angular)
  const principalRole = getPrincipalRole(user);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchArticles()),
          dispatch(fetchCategories()),
          dispatch(fetchClients()),
          dispatch(fetchFournisseurs()),
          dispatch(fetchCommandesClient()),
          dispatch(fetchCommandesFournisseur()),
        ]);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };

    loadData();
  }, [dispatch]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Bonjour';
    
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }

    return `${greeting} ! Bienvenue dans votre système de gestion de stock`;
  };

  const stats = [
    {
      title: 'Articles',
      value: articles.length,
      icon: <Inventory fontSize="large" />,
      color: 'primary',
      loading: articlesLoading,
    },
    {
      title: 'Catégories',
      value: categories.length,
      icon: <Category fontSize="large" />,
      color: 'secondary',
      loading: categoriesLoading,
    },
    {
      title: 'Clients',
      value: clients.length,
      icon: <People fontSize="large" />,
      color: 'success',
      loading: clientsLoading,
    },
    {
      title: 'Fournisseurs',
      value: fournisseurs.length,
      icon: <Business fontSize="large" />,
      color: 'warning',
      loading: fournisseursLoading,
    },
    {
      title: 'Commandes Client',
      value: commandesClient.length,
      icon: <ShoppingCart fontSize="large" />,
      color: 'info',
      loading: commandesLoading,
    },
    {
      title: 'Commandes Fournisseur',
      value: commandesFournisseur.length,
      icon: <TrendingUp fontSize="large" />,
      color: 'error',
      loading: commandesLoading,
    },
  ];

  return (
    <Box>
      {/* En-tête de bienvenue */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Voici un aperçu de votre système de gestion de stock
        </Typography>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={stat.loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Informations supplémentaires */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Activité récente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consultez les dernières activités de votre système de gestion de stock.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Statistiques
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accédez aux rapports et analyses de votre activité.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
