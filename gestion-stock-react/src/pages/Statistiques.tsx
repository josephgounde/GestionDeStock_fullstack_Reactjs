import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Inventory,
  People,
  Business,
  ShoppingCart,
  TrendingUp,
  Category,
  Assessment,
  Timeline,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchArticles } from '../store/slices/articleSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchClients } from '../store/slices/clientSlice';
import { fetchFournisseurs } from '../store/slices/fournisseurSlice';
import { fetchCommandesClient, fetchCommandesFournisseur } from '../store/slices/commandeSlice';
import { fetchMouvements } from '../store/slices/mvtStkSlice';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading = false, subtitle }) => {
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
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Statistiques: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { articles, loading: articlesLoading } = useAppSelector((state) => state.articles);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { clients, loading: clientsLoading } = useAppSelector((state) => state.clients);
  const { fournisseurs, loading: fournisseursLoading } = useAppSelector((state) => state.fournisseurs);
  const { commandesClient, commandesFournisseur, loading: commandesLoading } = useAppSelector((state) => state.commandes);
  const { mouvements, loading: mouvementsLoading } = useAppSelector((state) => state.mvtStk);

  const [error, setError] = useState<string | null>(null);

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
          dispatch(fetchMouvements()),
        ]);
      } catch (err) {
        setError('Erreur lors du chargement des données statistiques');
      }
    };

    loadData();
  }, [dispatch]);

  // Calculs statistiques avancés
  const totalCommandes = commandesClient.length + commandesFournisseur.length;
  const articlesEnStock = articles.filter(article => article.id).length; // Articles avec ID (existants)
  const categoriesActives = categories.filter(cat => cat.id).length;
  const mouvementsRecents = mouvements.filter(mvt => {
    const mvtDate = new Date(mvt.dateMvt || '');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return mvtDate >= weekAgo;
  }).length;

  // Top 5 des catégories par nombre d'articles
  const categoriesStats = categories.map(category => ({
    ...category,
    nombreArticles: articles.filter(article => article.category?.id === category.id).length
  })).sort((a, b) => b.nombreArticles - a.nombreArticles).slice(0, 5);

  const stats = [
    {
      title: 'Articles en Stock',
      value: articlesEnStock,
      icon: <Inventory fontSize="large" />,
      color: 'primary',
      loading: articlesLoading,
      subtitle: `sur ${articles.length} total`
    },
    {
      title: 'Catégories Actives',
      value: categoriesActives,
      icon: <Category fontSize="large" />,
      color: 'secondary',
      loading: categoriesLoading,
      subtitle: `${categories.length} catégories`
    },
    {
      title: 'Clients Actifs',
      value: clients.length,
      icon: <People fontSize="large" />,
      color: 'success',
      loading: clientsLoading,
      subtitle: 'clients enregistrés'
    },
    {
      title: 'Fournisseurs',
      value: fournisseurs.length,
      icon: <Business fontSize="large" />,
      color: 'warning',
      loading: fournisseursLoading,
      subtitle: 'partenaires actifs'
    },
    {
      title: 'Total Commandes',
      value: totalCommandes,
      icon: <ShoppingCart fontSize="large" />,
      color: 'info',
      loading: commandesLoading,
      subtitle: `${commandesClient.length} clients + ${commandesFournisseur.length} fournisseurs`
    },
    {
      title: 'Mouvements (7j)',
      value: mouvementsRecents,
      icon: <TrendingUp fontSize="large" />,
      color: 'error',
      loading: mouvementsLoading,
      subtitle: 'cette semaine'
    },
  ];

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment />
          Statistiques Détaillées
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyse complète de votre système de gestion de stock
        </Typography>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={stat.loading}
              subtitle={stat.subtitle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Analyses détaillées */}
      <Grid container spacing={3}>
        {/* Top Catégories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline />
                Top 5 Catégories
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Catégorie</strong></TableCell>
                      <TableCell align="right"><strong>Articles</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesStats.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.designation}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {category.nombreArticles}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Résumé des activités */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Résumé d'Activité
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">Commandes Client</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {commandesClient.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">Commandes Fournisseur</Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {commandesFournisseur.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">Mouvements de Stock</Typography>
                  <Typography variant="body2" fontWeight="bold" color="info.main">
                    {mouvements.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="white">Utilisateur Connecté</Typography>
                  <Typography variant="body2" fontWeight="bold" color="white">
                    {user?.prenom} {user?.nom}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistiques;
