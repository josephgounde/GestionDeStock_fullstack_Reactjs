import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Inventory,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { MvtStkDto, TypeMvtStk } from '../../types';

interface DetailMvtStkProps {
  mouvement: MvtStkDto;
  showArticleInfo?: boolean;
  compact?: boolean;
}

const DetailMvtStk: React.FC<DetailMvtStkProps> = ({ 
  mouvement, 
  showArticleInfo = true, 
  compact = false 
}) => {
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

  const getTypeIcon = (type: TypeMvtStk | undefined) => {
    if (!type) return <SwapHoriz />;
    switch (type) {
      case TypeMvtStk.ENTREE: return <TrendingUp />;
      case TypeMvtStk.SORTIE: return <TrendingDown />;
      default: return <SwapHoriz />;
    }
  };

  const getQuantityDisplay = () => {
    const prefix = mouvement.typeMvt === TypeMvtStk.ENTREE ? '+' : 
                   mouvement.typeMvt === TypeMvtStk.SORTIE ? '-' : '±';
    return `${prefix}${mouvement.quantite || 0}`;
  };

  if (compact) {
    return (
      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: `${getTypeColor(mouvement.typeMvt)}.light` }}>
              {getTypeIcon(mouvement.typeMvt)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {mouvement.typeMvt}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mouvement.dateMvt ? new Date(mouvement.dateMvt).toLocaleDateString('fr-FR') : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            color={`${getTypeColor(mouvement.typeMvt)}.main`}
          >
            {getQuantityDisplay()}
          </Typography>
        </Box>
        {mouvement.sourceMvt && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Source: {mouvement.sourceMvt}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* En-tête du mouvement */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: `${getTypeColor(mouvement.typeMvt)}.light` }}>
              {getTypeIcon(mouvement.typeMvt)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Mouvement de Stock
              </Typography>
              <Chip 
                label={mouvement.typeMvt} 
                color={getTypeColor(mouvement.typeMvt)} 
                size="small" 
              />
            </Box>
          </Box>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            color={`${getTypeColor(mouvement.typeMvt)}.main`}
          >
            {getQuantityDisplay()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Détails du mouvement */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">Date:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {mouvement.dateMvt ? new Date(mouvement.dateMvt).toLocaleDateString('fr-FR') : 'Non définie'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">Source:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {mouvement.sourceMvt || 'Non définie'}
              </Typography>
            </Box>
          </Grid>

          {showArticleInfo && mouvement.article && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Inventory color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">Article:</Typography>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {mouvement.article.designation}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Code: {mouvement.article.codeArticle}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Informations supplémentaires */}
        {mouvement.id && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              ID Mouvement: {mouvement.id}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailMvtStk;
