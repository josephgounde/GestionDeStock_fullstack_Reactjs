import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Inventory,
  Category,
  Euro,
  Timeline,
  ShoppingCart,
  LocalShipping,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchArticleById, fetchHistoriqueVentes, fetchHistoriqueCommandesClient, fetchHistoriqueCommandesFournisseur } from '../store/slices/articleSlice';
import DetailMvtStkArticle from '../components/common/DetailMvtStkArticle';
import StockActions from '../components/common/StockActions';
import { mvtStkService } from '../services/mvtStkService';
import { MvtStkDto, TypeMvtStk } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`article-tabpanel-${index}`}
      aria-labelledby={`article-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentArticle, historiqueVentes, historiqueCommandesClient, historiqueCommandesFournisseur, loading, error } = useAppSelector((state) => state.articles);

  const [tabValue, setTabValue] = useState(0);
  const [mouvementsStock, setMouvementsStock] = useState<MvtStkDto[]>([]);
  const [stockReel, setStockReel] = useState<number>(0);
  const [loadingMvt, setLoadingMvt] = useState(false);

  useEffect(() => {
    if (id) {
      const articleId = parseInt(id);
      dispatch(fetchArticleById(articleId));
      dispatch(fetchHistoriqueVentes(articleId));
      dispatch(fetchHistoriqueCommandesClient(articleId));
      dispatch(fetchHistoriqueCommandesFournisseur(articleId));
      
      // Charger les mouvements de stock
      loadMouvementsStock(articleId);
    }
  }, [dispatch, id]);

  const loadMouvementsStock = async (articleId: number) => {
    setLoadingMvt(true);
    try {
      const [mouvements, stock] = await Promise.all([
        mvtStkService.findByArticle(articleId),
        mvtStkService.stockReelArticle(articleId)
      ]);
      setMouvementsStock(mouvements);
      setStockReel(stock);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
    } finally {
      setLoadingMvt(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTypeColor = (type: TypeMvtStk | undefined) => {
    if (!type) return 'default';
    switch (type) {
      case TypeMvtStk.ENTREE: return 'success';
      case TypeMvtStk.SORTIE: return 'error';
      case TypeMvtStk.CORRECTION_POS: return 'info';
      case TypeMvtStk.CORRECTION_NEG: return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentArticle) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Article non trouvé'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/articles')}>
          Retour aux articles
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/articles')}>
            Retour
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Détails de l'Article
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/nouvelarticle/${currentArticle.id}`)}
        >
          Modifier
        </Button>
      </Box>

      {/* Informations principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Inventory color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {currentArticle.designation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {currentArticle.codeArticle}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Category color="action" />
                    <Typography variant="body2" color="text.secondary">Catégorie:</Typography>
                    <Chip 
                      label={currentArticle.category?.designation || 'Non définie'} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Inventory color="action" />
                    <Typography variant="body2" color="text.secondary">Stock réel:</Typography>
                    <Chip 
                      label={`${stockReel} unités`} 
                      color={stockReel > 0 ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Euro />
                Informations Tarifaires
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Prix HT</Typography>
                <Typography variant="h6" color="primary">
                  {currentArticle.prixUnitaireHt?.toFixed(2) || '0.00'} €
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">TVA</Typography>
                <Typography variant="body1">
                  {currentArticle.tauxTva || 0}%
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">Prix TTC</Typography>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentArticle.prixUnitaireTtc?.toFixed(2) || '0.00'} €
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions de stock */}
        <Grid item xs={12} md={4}>
          <StockActions article={currentArticle} />
        </Grid>
      </Grid>

      {/* Onglets pour les détails */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Mouvements de Stock" icon={<Timeline />} />
            <Tab label="Historique Ventes" icon={<ShoppingCart />} />
            <Tab label="Commandes Client" icon={<ShoppingCart />} />
            <Tab label="Commandes Fournisseur" icon={<LocalShipping />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Mouvements de Stock</Typography>
          {loadingMvt ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                    <TableCell>Source</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mouvementsStock.map((mvt, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {mvt.dateMvt ? new Date(mvt.dateMvt).toLocaleDateString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={mvt.typeMvt} 
                          color={getTypeColor(mvt.typeMvt)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {mvt.quantite}
                      </TableCell>
                      <TableCell>{mvt.sourceMvt}</TableCell>
                    </TableRow>
                  ))}
                  {mouvementsStock.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary">Aucun mouvement de stock</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Historique des Ventes</Typography>
          <Typography color="text.secondary">
            {historiqueVentes.length > 0 ? `${historiqueVentes.length} vente(s)` : 'Aucune vente enregistrée'}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Commandes Client</Typography>
          <Typography color="text.secondary">
            {historiqueCommandesClient.length > 0 ? `${historiqueCommandesClient.length} commande(s) client` : 'Aucune commande client'}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Commandes Fournisseur</Typography>
          <Typography color="text.secondary">
            {historiqueCommandesFournisseur.length > 0 ? `${historiqueCommandesFournisseur.length} commande(s) fournisseur` : 'Aucune commande fournisseur'}
          </Typography>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ArticleDetails;
