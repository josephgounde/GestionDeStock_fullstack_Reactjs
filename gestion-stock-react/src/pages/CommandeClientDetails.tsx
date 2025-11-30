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
  CalendarToday,
  Assessment,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCommandeClientById, updateEtatCommandeClient } from '../store/slices/commandeSlice';
import { CommandeClientDto, EtatCommande } from '../types';

const CommandeClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCommandeClient, loading, error } = useAppSelector((state) => state.commandes);

  const [newEtat, setNewEtat] = useState<EtatCommande>(EtatCommande.EN_PREPARATION);
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    if (id) {
      console.log('🔍 Chargement des détails de la commande client ID:', id);
      setLocalError('');
      
      dispatch(fetchCommandeClientById(parseInt(id)))
        .unwrap()
        .then((commande) => {
          console.log('✅ Commande client chargée:', commande);
          setNewEtat(commande.etatCommande || EtatCommande.EN_PREPARATION);
        })
        .catch((error) => {
          console.error('❌ Erreur lors du chargement de la commande:', error);
          setLocalError('Impossible de charger les détails de la commande. Vérifiez que la commande existe.');
        });
    }
  }, [dispatch, id]);

  const handleEtatChange = async (nouvelEtat: EtatCommande) => {
    if (!currentCommandeClient?.id) return;

    try {
      await dispatch(updateEtatCommandeClient({
        id: currentCommandeClient.id,
        etat: nouvelEtat
      })).unwrap();
      
      setNewEtat(nouvelEtat);
      console.log('✅ État de la commande mis à jour:', nouvelEtat);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'état:', error);
      setLocalError('Erreur lors de la mise à jour de l\'état de la commande');
    }
  };

  const getEtatColor = (etat: EtatCommande) => {
    switch (etat) {
      case EtatCommande.EN_PREPARATION: return 'warning';
      case EtatCommande.VALIDEE: return 'info';
      case EtatCommande.LIVREE: return 'success';
      default: return 'default';
    }
  };

  const calculateTotal = () => {
    if (!currentCommandeClient?.ligneCommandeClients) return 0;
    return currentCommandeClient.ligneCommandeClients.reduce((total, ligne) => {
      return total + ((ligne.quantite || 0) * (ligne.prixUnitaire || 0));
    }, 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Chargement des détails de la commande...
        </Typography>
      </Box>
    );
  }

  if (localError || error) {
    return (
      <Box>
        <Box className="page-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/commandesclient')}
            sx={{ mb: 2 }}
          >
            Retour aux commandes
          </Button>
          <Typography variant="h4" className="page-title">
            Détails de la Commande Client
          </Typography>
        </Box>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          {localError || error}
          <br />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Cela peut être dû à :
          </Typography>
          <ul>
            <li>La commande n'existe pas dans la base de données</li>
            <li>Un problème de connexion avec le backend</li>
            <li>Une erreur dans l'API backend</li>
          </ul>
        </Alert>
        
        <Button
          variant="contained"
          onClick={() => navigate('/commandesclient')}
          startIcon={<ArrowBack />}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  if (!currentCommandeClient) {
    return (
      <Box>
        <Alert severity="warning">
          Aucune commande trouvée avec l'ID {id}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/commandesclient')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/commandesclient')}
          sx={{ mb: 2 }}
        >
          Retour aux commandes
        </Button>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" className="page-title">
            Commande Client #{currentCommandeClient.code}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/nouvellecommandeclt/${currentCommandeClient.id}`)}
          >
            Modifier
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations de la commande
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Code commande
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {currentCommandeClient.code}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date de commande
                  </Typography>
                  <Typography variant="body1">
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {currentCommandeClient.dateCommande 
                      ? new Date(currentCommandeClient.dateCommande).toLocaleDateString('fr-FR')
                      : 'Non définie'
                    }
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    État de la commande
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>État</InputLabel>
                    <Select
                      value={newEtat}
                      label="État"
                      onChange={(e) => handleEtatChange(e.target.value as EtatCommande)}
                    >
                      {Object.values(EtatCommande).map((etat) => (
                        <MenuItem key={etat} value={etat}>
                          <Chip 
                            label={etat} 
                            color={getEtatColor(etat)} 
                            size="small" 
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations client */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations client
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {currentCommandeClient.client ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Nom complet
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {`${currentCommandeClient.client.prenom || ''} ${currentCommandeClient.client.nom || ''}`.trim()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {currentCommandeClient.client.mail || 'Non renseigné'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1">
                      {currentCommandeClient.client.numTel || 'Non renseigné'}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="warning">
                  Aucun client associé à cette commande
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Articles commandés */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Articles commandés ({currentCommandeClient.ligneCommandeClients?.length || 0})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {currentCommandeClient.ligneCommandeClients && currentCommandeClient.ligneCommandeClients.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Article</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell align="right">Quantité</TableCell>
                        <TableCell align="right">Prix unitaire</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentCommandeClient.ligneCommandeClients.map((ligne, index) => (
                        <TableRow key={ligne.id || index}>
                          <TableCell>
                            {ligne.article?.designation || 'Article non défini'}
                          </TableCell>
                          <TableCell>
                            {ligne.article?.codeArticle || 'N/A'}
                          </TableCell>
                          <TableCell align="right">
                            {ligne.quantite || 0}
                          </TableCell>
                          <TableCell align="right">
                            {(ligne.prixUnitaire || 0).toFixed(2)} €
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {((ligne.quantite || 0) * (ligne.prixUnitaire || 0)).toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography variant="h6">Total de la commande:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary">
                            {calculateTotal().toFixed(2)} €
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Aucun article dans cette commande
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommandeClientDetails;
