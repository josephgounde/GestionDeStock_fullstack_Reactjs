import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Inventory,
} from '@mui/icons-material';
import { mvtStkService } from '../../services/mvtStkService';
import { ArticleDto } from '../../types';

interface StockActionsProps {
  article: ArticleDto;
  showTitle?: boolean;
}

const StockActions: React.FC<StockActionsProps> = ({ 
  article, 
  showTitle = true 
}) => {
  const navigate = useNavigate();
  const [stockActuel, setStockActuel] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (article.id) {
      loadStockActuel();
    }
  }, [article.id]);

  const loadStockActuel = async () => {
    if (!article.id) return;
    
    setLoading(true);
    try {
      const stock = await mvtStkService.stockReelArticle(article.id);
      setStockActuel(stock);
    } catch (err) {
      console.error('Erreur lors du chargement du stock:', err);
      setError('Impossible de charger le stock actuel');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: string) => {
    // Stocker l'article dans le sessionStorage pour le formulaire
    sessionStorage.setItem('selectedArticle', JSON.stringify(article));
    navigate(`/nouveau-mouvement/${type}`);
  };

  const getStockColor = () => {
    if (stockActuel <= 0) return 'error.main';
    if (stockActuel <= 10) return 'warning.main';
    return 'success.main';
  };

  const getStockStatus = () => {
    if (stockActuel <= 0) return 'Stock épuisé';
    if (stockActuel <= 10) return 'Stock faible';
    return 'Stock normal';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Chargement du stock...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        {showTitle && (
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory />
            Gestion du Stock
          </Typography>
        )}

        {/* Stock actuel */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" color={getStockColor()} fontWeight="bold">
            {stockActuel}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            unités en stock
          </Typography>
          <Typography variant="caption" color={getStockColor()}>
            {getStockStatus()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Actions rapides */}
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Actions rapides
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="success"
              startIcon={<TrendingUp />}
              onClick={() => handleAction('entree')}
              sx={{ py: 1.5 }}
            >
              Entrée
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<TrendingDown />}
              onClick={() => handleAction('sortie')}
              disabled={stockActuel <= 0}
              sx={{ py: 1.5 }}
            >
              Sortie
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="info"
              startIcon={<SwapHoriz />}
              onClick={() => handleAction('correction')}
              sx={{ py: 1.5 }}
            >
              Correction
            </Button>
          </Grid>
        </Grid>

        {/* Alertes */}
        {stockActuel <= 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            ⚠️ Stock épuisé ! Pensez à commander cet article.
          </Alert>
        )}
        
        {stockActuel > 0 && stockActuel <= 10 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            ⚠️ Stock faible ({stockActuel} unités). Envisagez un réapprovisionnement.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default StockActions;
