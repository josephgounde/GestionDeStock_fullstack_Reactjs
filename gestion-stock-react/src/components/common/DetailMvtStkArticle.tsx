import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  Timeline,
  Inventory,
  Assessment,
} from '@mui/icons-material';
import { mvtStkService } from '../../services/mvtStkService';
import { MvtStkDto, ArticleDto, TypeMvtStk } from '../../types';
import DetailMvtStk from './DetailMvtStk';

interface DetailMvtStkArticleProps {
  article: ArticleDto;
  showTitle?: boolean;
  maxItems?: number;
}

const DetailMvtStkArticle: React.FC<DetailMvtStkArticleProps> = ({ 
  article, 
  showTitle = true,
  maxItems = 10 
}) => {
  const [mouvements, setMouvements] = useState<MvtStkDto[]>([]);
  const [stockReel, setStockReel] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (article.id) {
      loadMouvementsArticle(article.id);
    }
  }, [article.id]);

  const loadMouvementsArticle = async (articleId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const [mouvementsData, stockData] = await Promise.all([
        mvtStkService.findByArticle(articleId),
        mvtStkService.stockReelArticle(articleId)
      ]);
      
      // Trier par date décroissante et limiter le nombre d'éléments
      const sortedMouvements = mouvementsData
        .sort((a, b) => new Date(b.dateMvt || '').getTime() - new Date(a.dateMvt || '').getTime())
        .slice(0, maxItems);
      
      setMouvements(sortedMouvements);
      setStockReel(stockData);
    } catch (err) {
      setError('Erreur lors du chargement des mouvements de stock');
      console.error('Erreur mouvements:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const entrees = mouvements.filter(mvt => mvt.typeMvt === TypeMvtStk.ENTREE);
    const sorties = mouvements.filter(mvt => mvt.typeMvt === TypeMvtStk.SORTIE);
    const corrections = mouvements.filter(mvt => 
      mvt.typeMvt === TypeMvtStk.CORRECTION_POS || mvt.typeMvt === TypeMvtStk.CORRECTION_NEG
    );

    return {
      totalEntrees: entrees.reduce((sum, mvt) => sum + (mvt.quantite || 0), 0),
      totalSorties: sorties.reduce((sum, mvt) => sum + (mvt.quantite || 0), 0),
      nombreCorrections: corrections.length,
      dernierMouvement: mouvements[0]?.dateMvt ? new Date(mouvements[0].dateMvt) : null,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Chargement des mouvements...
            </Typography>
          </Box>
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
    <Box>
      {showTitle && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Timeline />
            Historique des Mouvements - {article.designation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Code: {article.codeArticle}
          </Typography>
        </Box>
      )}

      {/* Statistiques rapides */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {stockReel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Stock Actuel
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                +{stats.totalEntrees}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Entrées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                -{stats.totalSorties}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Sorties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {stats.nombreCorrections}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Corrections
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informations sur le dernier mouvement */}
      {stats.dernierMouvement && (
        <Card sx={{ mb: 3, bgcolor: 'info.light' }}>
          <CardContent>
            <Typography variant="body2" color="info.contrastText">
              <strong>Dernier mouvement:</strong> {stats.dernierMouvement.toLocaleDateString('fr-FR')} à {stats.dernierMouvement.toLocaleTimeString('fr-FR')}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Liste des mouvements */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment />
          Mouvements Récents
          {maxItems < mouvements.length && (
            <Chip label={`${maxItems} derniers`} size="small" color="primary" />
          )}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />

        {mouvements.length === 0 ? (
          <Card>
            <CardContent>
              <Box textAlign="center" py={4}>
                <Inventory sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Aucun mouvement de stock pour cet article
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {mouvements.map((mouvement, index) => (
              <DetailMvtStk 
                key={mouvement.id || index} 
                mouvement={mouvement} 
                showArticleInfo={false}
                compact={true}
              />
            ))}
            
            {mouvements.length >= maxItems && (
              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Affichage des {maxItems} mouvements les plus récents
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DetailMvtStkArticle;
