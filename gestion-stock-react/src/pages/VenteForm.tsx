import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Save, Cancel, PointOfSale, Add, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveVente, fetchVenteById, setCurrentVente } from '../store/slices/ventesSlice';
import { fetchArticles } from '../store/slices/articleSlice';
import { VentesDto, LigneVenteDto, ArticleDto } from '../types';

const VenteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentVente, loading, error } = useAppSelector((state) => state.ventes);
  const { articles } = useAppSelector((state) => state.articles);

  const [formData, setFormData] = useState<VentesDto>({
    code: '',
    dateVente: new Date().toISOString().split('T')[0],
    commentaire: '',
    ligneVentes: [],
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(null);
  const [quantite, setQuantite] = useState<number>(1);
  const [prixUnitaire, setPrixUnitaire] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchArticles());
    
    if (id) {
      // Mode édition
      dispatch(fetchVenteById(parseInt(id)));
    } else {
      // Mode création - générer un code automatique
      dispatch(setCurrentVente(null));
      setFormData(prev => ({
        ...prev,
        code: `VTE${Date.now()}`,
      }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentVente && id) {
      setFormData(currentVente);
    }
  }, [currentVente, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Effacer l'erreur de validation si elle existe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleArticleChange = (article: ArticleDto | null) => {
    setSelectedArticle(article);
    if (article) {
      setPrixUnitaire(article.prixUnitaireTtc || article.prixUnitaireHt || 0);
    } else {
      setPrixUnitaire(0);
    }
  };

  const handleAddLigne = () => {
    if (!selectedArticle) {
      alert('Veuillez sélectionner un article');
      return;
    }

    if (quantite <= 0) {
      alert('La quantité doit être supérieure à 0');
      return;
    }

    if (prixUnitaire <= 0) {
      alert('Le prix unitaire doit être supérieur à 0');
      return;
    }

    // Vérifier si l'article n'est pas déjà dans la liste
    const existingLigne = formData.ligneVentes?.find(ligne => ligne.article?.id === selectedArticle.id);
    if (existingLigne) {
      alert('Cet article est déjà dans la vente');
      return;
    }

    const nouvelleLigne: LigneVenteDto = {
      id: Date.now(), // ID temporaire
      article: selectedArticle,
      quantite: quantite,
      prixUnitaire: prixUnitaire,
    };

    setFormData(prev => ({
      ...prev,
      ligneVentes: [...(prev.ligneVentes || []), nouvelleLigne],
    }));

    // Réinitialiser les champs
    setSelectedArticle(null);
    setQuantite(1);
    setPrixUnitaire(0);
  };

  const handleRemoveLigne = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ligneVentes: prev.ligneVentes?.filter((_, i) => i !== index) || [],
    }));
  };

  const calculateTotal = () => {
    return formData.ligneVentes?.reduce((total, ligne) => {
      return total + ((ligne.quantite || 0) * (ligne.prixUnitaire || 0));
    }, 0) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: { [key: string]: string } = {};
    
    if (!formData.code?.trim()) {
      errors.code = 'Le code de vente est requis';
    }
    
    if (!formData.dateVente) {
      errors.dateVente = 'La date de vente est requise';
    }

    if (!formData.ligneVentes || formData.ligneVentes.length === 0) {
      errors.ligneVentes = 'Au moins un article doit être ajouté à la vente';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await dispatch(saveVente(formData)).unwrap();
      navigate('/ventes');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/ventes');
  };

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          <PointOfSale sx={{ mr: 1, verticalAlign: 'middle' }} />
          {id ? 'Modifier la Vente' : 'Nouvelle Vente'}
        </Typography>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulaire */}
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Informations de base */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Informations de la vente
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Code de vente"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  error={!!validationErrors.code}
                  helperText={validationErrors.code}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date de vente"
                  name="dateVente"
                  type="date"
                  value={formData.dateVente || ''}
                  onChange={handleChange}
                  error={!!validationErrors.dateVente}
                  helperText={validationErrors.dateVente}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Commentaire"
                  name="commentaire"
                  value={formData.commentaire || ''}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Ajout d'articles */}
              <Grid item xs={12}>
                <Typography variant="h6" className="form-section-title">
                  Ajouter des articles
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={articles}
                  getOptionLabel={(option) => `${option.codeArticle} - ${option.designation}`}
                  value={selectedArticle}
                  onChange={(_, newValue) => handleArticleChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionner un article" />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Quantité"
                  type="number"
                  value={quantite}
                  onChange={(e) => setQuantite(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Prix unitaire (€)"
                  type="number"
                  value={prixUnitaire}
                  onChange={(e) => setPrixUnitaire(parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddLigne}
                  sx={{ height: '56px' }}
                >
                  Ajouter
                </Button>
              </Grid>

              {/* Liste des articles */}
              {formData.ligneVentes && formData.ligneVentes.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" className="form-section-title">
                      Articles de la vente
                    </Typography>
                    {validationErrors.ligneVentes && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {validationErrors.ligneVentes}
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Article</TableCell>
                            <TableCell align="center">Quantité</TableCell>
                            <TableCell align="right">Prix unitaire</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.ligneVentes.map((ligne, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {ligne.article?.codeArticle}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {ligne.article?.designation}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">{ligne.quantite}</TableCell>
                              <TableCell align="right">{ligne.prixUnitaire?.toFixed(2)} €</TableCell>
                              <TableCell align="right">
                                <Typography fontWeight="bold">
                                  {((ligne.quantite || 0) * (ligne.prixUnitaire || 0)).toFixed(2)} €
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveLigne(index)}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Typography variant="h6" align="right">
                                Total de la vente:
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="h6" color="success.main" fontWeight="bold">
                                {calculateTotal().toFixed(2)} €
                              </Typography>
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}

              {/* Boutons d'action */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
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

export default VenteForm;
