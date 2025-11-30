import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  ShoppingCart,
  Person,
  Business,
  CalendarToday,
  Assessment,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCommandeClientById, fetchCommandeFournisseurById, updateEtatCommandeClient, updateEtatCommandeFournisseur } from '../store/slices/commandeSlice';
import { EtatCommande } from '../types';

interface CommandeDetailsProps {
  type: 'client' | 'fournisseur';
}

const CommandeDetails: React.FC<CommandeDetailsProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCommandeClient, currentCommandeFournisseur, loading, error } = useAppSelector((state) => state.commandes);

  const [newEtat, setNewEtat] = useState<EtatCommande>(EtatCommande.EN_PREPARATION);

  const commande = type === 'client' ? currentCommandeClient : currentCommandeFournisseur;

  useEffect(() => {
    if (id) {
      const commandeId = parseInt(id);
      if (type === 'client') {
        dispatch(fetchCommandeClientById(commandeId));
      } else {
        dispatch(fetchCommandeFournisseurById(commandeId));
      }
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (commande) {
      setNewEtat(commande.etatCommande || EtatCommande.EN_PREPARATION);
    }
  }, [commande]);

  const handleEtatChange = async (nouvelEtat: EtatCommande) => {
    if (!commande?.id) return;

    try {
      if (type === 'client') {
        await dispatch(updateEtatCommandeClient({ id: commande.id, etat: nouvelEtat })).unwrap();
      } else {
        await dispatch(updateEtatCommandeFournisseur({ id: commande.id, etat: nouvelEtat })).unwrap();
      }
      setNewEtat(nouvelEtat);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état:', error);
    }
  };

  const getEtatColor = (etat: EtatCommande | undefined) => {
    if (!etat) return 'default';
    switch (etat) {
      case EtatCommande.EN_PREPARATION: return 'warning';
      case EtatCommande.VALIDEE: return 'info';
      case EtatCommande.LIVREE: return 'success';
      default: return 'default';
    }
  };

  const calculateTotal = () => {
    if (!commande) return 0;
    if (type === 'client') {
      const commandeClient = commande as any;
      return commandeClient.ligneCommandeClients?.reduce((total: number, ligne: any) => {
        return total + (ligne.quantite * ligne.prixUnitaire || 0);
      }, 0) || 0;
    } else {
      const commandeFournisseur = commande as any;
      return commandeFournisseur.ligneCommandeFournisseurs?.reduce((total: number, ligne: any) => {
        return total + (ligne.quantite * ligne.prixUnitaire || 0);
      }, 0) || 0;
    }
  };

  const getPersonne = () => {
    if (type === 'client') {
      return (commande as any)?.client;
    } else {
      return (commande as any)?.fournisseur;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !commande) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Commande non trouvée'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(`/commandes${type}`)}>
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  const personne = getPersonne();
  const lignes = type === 'client' ? (commande as any)?.ligneCommandeClients : (commande as any)?.ligneCommandeFournisseurs;

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(`/commandes${type}`)}>
            Retour
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Détails de la Commande {type === 'client' ? 'Client' : 'Fournisseur'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/nouvellecommande${type === 'client' ? 'clt' : 'frs'}/${commande.id}`)}
        >
          Modifier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Informations de la commande */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ShoppingCart color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Commande {commande.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type === 'client' ? 'Commande Client' : 'Commande Fournisseur'}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday color="action" />
                    <Typography variant="body2" color="text.secondary">Date:</Typography>
                    <Typography variant="body1">
                      {commande.dateCommande ? new Date(commande.dateCommande).toLocaleDateString('fr-FR') : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Assessment color="action" />
                    <Typography variant="body2" color="text.secondary">État:</Typography>
                    <Chip 
                      label={commande.etatCommande} 
                      color={getEtatColor(commande.etatCommande)} 
                      size="small" 
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Informations client/fournisseur */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {type === 'client' ? <Person color="action" /> : <Business color="action" />}
                <Typography variant="body2" color="text.secondary">
                  {type === 'client' ? 'Client:' : 'Fournisseur:'}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {personne ? `${personne.prenom} ${personne.nom}` : 'Non défini'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions et résumé */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestion de la Commande
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Changer l'état */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>État de la commande</InputLabel>
                <Select
                  value={newEtat}
                  label="État de la commande"
                  onChange={(e) => handleEtatChange(e.target.value as EtatCommande)}
                >
                  <MenuItem value={EtatCommande.EN_PREPARATION}>En Préparation</MenuItem>
                  <MenuItem value={EtatCommande.VALIDEE}>Validée</MenuItem>
                  <MenuItem value={EtatCommande.LIVREE}>Livrée</MenuItem>
                </Select>
              </FormControl>

              {/* Résumé financier */}
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">Total de la commande</Typography>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {calculateTotal().toFixed(2)} €
                </Typography>
              </Box>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {lignes?.length || 0} article(s)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Détail des lignes de commande */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détail des Articles
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Article</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Prix Unitaire</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lignes?.map((ligne: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {ligne.article?.designation || 'Article non défini'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code: {ligne.article?.codeArticle || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{ligne.quantite}</TableCell>
                        <TableCell align="right">{ligne.prixUnitaire?.toFixed(2) || '0.00'} €</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {((ligne.quantite || 0) * (ligne.prixUnitaire || 0)).toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!lignes || lignes.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">Aucun article dans cette commande</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommandeDetails;
