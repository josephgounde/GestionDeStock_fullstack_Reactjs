import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Save,
  Cancel,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Inventory,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchArticles } from '../store/slices/articleSlice';
import { saveEntreeStock, saveSortieStock, saveCorrectionPos, saveCorrectionNeg } from '../store/slices/mvtStkSlice';
import { mvtStkService } from '../services/mvtStkService';
import { MvtStkDto, TypeMvtStk, SourceMvtStk, ArticleDto } from '../types';

const MouvementStockForm: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const dispatch = useAppDispatch();
  const { articles } = useAppSelector((state) => state.articles);

  const [formData, setFormData] = useState<MvtStkDto>({
    quantite: 0,
    typeMvt: TypeMvtStk.ENTREE,
    sourceMvt: SourceMvtStk.COMMANDE_FOURNISSEUR,
    dateMvt: new Date().toISOString(),
    article: undefined,
    idEntreprise: 1,
  });

  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(null);
  const [stockActuel, setStockActuel] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    dispatch(fetchArticles());
    
    // Récupérer l'article pré-sélectionné depuis sessionStorage
    const savedArticle = sessionStorage.getItem('selectedArticle');
    if (savedArticle) {
      try {
        const article = JSON.parse(savedArticle);
        setSelectedArticle(article);
        sessionStorage.removeItem('selectedArticle'); // Nettoyer après utilisation
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    }
    
    // Définir le type de mouvement selon l'URL
    if (type) {
      switch (type.toLowerCase()) {
        case 'entree':
          setFormData(prev => ({
            ...prev,
            typeMvt: TypeMvtStk.ENTREE,
            sourceMvt: SourceMvtStk.COMMANDE_FOURNISSEUR
          }));
          break;
        case 'sortie':
          setFormData(prev => ({
            ...prev,
            typeMvt: TypeMvtStk.SORTIE,
            sourceMvt: SourceMvtStk.VENTE
          }));
          break;
        case 'correction':
          setFormData(prev => ({
            ...prev,
            typeMvt: TypeMvtStk.CORRECTION_POS,
            sourceMvt: SourceMvtStk.COMMANDE_FOURNISSEUR
          }));
          break;
      }
    }
  }, [dispatch, type]);

  useEffect(() => {
    if (selectedArticle?.id) {
      loadStockActuel(selectedArticle.id);
      setFormData(prev => ({
        ...prev,
        article: selectedArticle
      }));
    }
  }, [selectedArticle]);

  const loadStockActuel = async (articleId: number) => {
    try {
      const stock = await mvtStkService.stockReelArticle(articleId);
      setStockActuel(stock);
    } catch (error) {
      console.error('Erreur lors du chargement du stock:', error);
      setStockActuel(0);
    }
  };

  const handleChange = (field: keyof MvtStkDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleTypeChange = (newType: TypeMvtStk) => {
    let defaultSource = SourceMvtStk.COMMANDE_FOURNISSEUR;
    
    switch (newType) {
      case TypeMvtStk.ENTREE:
        defaultSource = SourceMvtStk.COMMANDE_FOURNISSEUR;
        break;
      case TypeMvtStk.SORTIE:
        defaultSource = SourceMvtStk.VENTE;
        break;
      case TypeMvtStk.CORRECTION_POS:
      case TypeMvtStk.CORRECTION_NEG:
        defaultSource = SourceMvtStk.COMMANDE_FOURNISSEUR;
        break;
    }

    setFormData(prev => ({
      ...prev,
      typeMvt: newType,
      sourceMvt: defaultSource
    }));
  };

  const validateForm = (): boolean => {
    if (!selectedArticle) {
      setError('Veuillez sélectionner un article');
      return false;
    }

    if (!formData.quantite || formData.quantite <= 0) {
      setError('Veuillez saisir une quantité positive');
      return false;
    }

    // Vérification pour les sorties
    if (formData.typeMvt === TypeMvtStk.SORTIE && (formData.quantite || 0) > stockActuel) {
      setError(`Stock insuffisant. Stock actuel: ${stockActuel}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const mouvementToSave = {
        ...formData,
        dateMvt: new Date().toISOString(),
      };

      let result: MvtStkDto;

      switch (formData.typeMvt) {
        case TypeMvtStk.ENTREE:
          result = await dispatch(saveEntreeStock(mouvementToSave)).unwrap();
          break;
        case TypeMvtStk.SORTIE:
          result = await dispatch(saveSortieStock(mouvementToSave)).unwrap();
          break;
        case TypeMvtStk.CORRECTION_POS:
          result = await dispatch(saveCorrectionPos(mouvementToSave)).unwrap();
          break;
        case TypeMvtStk.CORRECTION_NEG:
          result = await dispatch(saveCorrectionNeg(mouvementToSave)).unwrap();
          break;
        default:
          throw new Error('Type de mouvement non supporté');
      }

      console.log('✅ Mouvement de stock enregistré:', result);
      setSuccess('Mouvement de stock enregistré avec succès');
      
      // Recharger le stock actuel
      if (selectedArticle?.id) {
        await loadStockActuel(selectedArticle.id);
      }

      // Réinitialiser le formulaire
      setFormData(prev => ({
        ...prev,
        quantite: 0,
        dateMvt: new Date().toISOString(),
      }));

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/mouvements-stock');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement du mouvement');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: TypeMvtStk) => {
    switch (type) {
      case TypeMvtStk.ENTREE: return <TrendingUp />;
      case TypeMvtStk.SORTIE: return <TrendingDown />;
      default: return <SwapHoriz />;
    }
  };

  const getTypeColor = (type: TypeMvtStk): 'success' | 'error' | 'info' | 'warning' | 'default' => {
    switch (type) {
      case TypeMvtStk.ENTREE: return 'success';
      case TypeMvtStk.SORTIE: return 'error';
      case TypeMvtStk.CORRECTION_POS: return 'info';
      case TypeMvtStk.CORRECTION_NEG: return 'warning';
      default: return 'default';
    }
  };

  const getFormTitle = () => {
    switch (formData.typeMvt) {
      case TypeMvtStk.ENTREE: return 'Nouvelle Entrée de Stock';
      case TypeMvtStk.SORTIE: return 'Nouvelle Sortie de Stock';
      case TypeMvtStk.CORRECTION_POS: return 'Correction de Stock Positive';
      case TypeMvtStk.CORRECTION_NEG: return 'Correction de Stock Négative';
      default: return 'Nouveau Mouvement de Stock';
    }
  };

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory />
          {getFormTitle()}
        </Typography>
      </Box>

      <Card className="form-container">
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Type de mouvement */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Type de mouvement
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {Object.values(TypeMvtStk).map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      icon={getTypeIcon(type)}
                      color={formData.typeMvt === type ? getTypeColor(type) : 'default'}
                      variant={formData.typeMvt === type ? 'filled' : 'outlined'}
                      clickable
                      onClick={() => handleTypeChange(type)}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Sélection article */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={articles}
                  getOptionLabel={(option) => `${option.designation} (${option.codeArticle})`}
                  value={selectedArticle}
                  onChange={(_, newValue) => setSelectedArticle(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Article"
                      required
                      helperText="Recherchez par nom ou code article"
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body1">{option.designation}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Code: {option.codeArticle} | Prix: {option.prixUnitaireHt}€
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              {/* Stock actuel */}
              {selectedArticle && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {stockActuel}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock actuel
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Quantité */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantité"
                  type="number"
                  value={formData.quantite}
                  onChange={(e) => handleChange('quantite', parseFloat(e.target.value) || 0)}
                  required
                  inputProps={{ min: 0, step: 1 }}
                  helperText={
                    formData.typeMvt === TypeMvtStk.SORTIE && stockActuel > 0
                      ? `Maximum disponible: ${stockActuel}`
                      : undefined
                  }
                />
              </Grid>

              {/* Source du mouvement */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Source du mouvement</InputLabel>
                  <Select
                    value={formData.sourceMvt}
                    label="Source du mouvement"
                    onChange={(e) => handleChange('sourceMvt', e.target.value)}
                  >
                    {Object.values(SourceMvtStk).map((source) => (
                      <MenuItem key={source} value={source}>
                        {source.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Résumé du mouvement */}
              {selectedArticle && (formData.quantite || 0) > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Résumé du mouvement
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Article:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedArticle.designation}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Type:</Typography>
                          <Chip 
                            label={formData.typeMvt || 'N/A'} 
                            color={formData.typeMvt ? getTypeColor(formData.typeMvt) : 'default'}
                            size="small"
                            icon={formData.typeMvt ? getTypeIcon(formData.typeMvt) : undefined}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Quantité:</Typography>
                          <Typography 
                            variant="body1" 
                            fontWeight="bold"
                            color={
                              formData.typeMvt === TypeMvtStk.ENTREE ? 'success.main' :
                              formData.typeMvt === TypeMvtStk.SORTIE ? 'error.main' : 'info.main'
                            }
                          >
                            {formData.typeMvt === TypeMvtStk.ENTREE ? '+' : 
                             formData.typeMvt === TypeMvtStk.SORTIE ? '-' : '±'}
                            {formData.quantite || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Nouveau stock:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {(() => {
                              const qty = formData.quantite || 0;
                              switch (formData.typeMvt) {
                                case TypeMvtStk.ENTREE:
                                  return stockActuel + qty;
                                case TypeMvtStk.SORTIE:
                                  return stockActuel - qty;
                                case TypeMvtStk.CORRECTION_POS:
                                  return stockActuel + qty;
                                case TypeMvtStk.CORRECTION_NEG:
                                  return stockActuel - qty;
                                default:
                                  return stockActuel;
                              }
                            })()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Boutons d'action */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/mouvements-stock')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading || !selectedArticle || (formData.quantite || 0) <= 0}
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

export default MouvementStockForm;
