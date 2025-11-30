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
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Person,
  Email,
  Phone,
  LocationOn,
  ShoppingCart,
  Assessment,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchClientById } from '../store/slices/clientSlice';
import { fetchCommandesClient } from '../store/slices/commandeSlice';
import { EtatCommande } from '../types';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentClient, loading, error } = useAppSelector((state) => state.clients);
  const { commandesClient } = useAppSelector((state) => state.commandes);

  const [clientCommandes, setClientCommandes] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const clientId = parseInt(id);
      dispatch(fetchClientById(clientId));
      dispatch(fetchCommandesClient());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentClient && commandesClient.length > 0) {
      // Filtrer les commandes de ce client
      const commandes = commandesClient.filter(cmd => cmd.client?.id === currentClient.id);
      setClientCommandes(commandes);
    }
  }, [currentClient, commandesClient]);

  const getEtatColor = (etat: EtatCommande) => {
    switch (etat) {
      case EtatCommande.EN_PREPARATION: return 'warning';
      case EtatCommande.VALIDEE: return 'info';
      case EtatCommande.LIVREE: return 'success';
      default: return 'default';
    }
  };

  const calculateTotalCommandes = () => {
    return clientCommandes.reduce((total, commande) => {
      const commandeTotal = commande.ligneCommandeClients?.reduce((sum: number, ligne: any) => {
        return sum + (ligne.quantite * ligne.prixUnitaire || 0);
      }, 0) || 0;
      return total + commandeTotal;
    }, 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentClient) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Client non trouvé'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/clients')}>
          Retour aux clients
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/clients')}>
            Retour
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Détails du Client
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/nouveauclient/${currentClient.id}`)}
        >
          Modifier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Informations personnelles */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {currentClient.prenom} {currentClient.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Client
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Email color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                </Box>
                <Typography variant="body1">
                  {currentClient.mail || 'Non renseigné'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Phone color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">Téléphone:</Typography>
                </Box>
                <Typography variant="body1">
                  {currentClient.numTel || 'Non renseigné'}
                </Typography>
              </Box>

              {currentClient.adresse && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">Adresse:</Typography>
                  </Box>
                  <Typography variant="body1">
                    {currentClient.adresse.adresse1}
                    {currentClient.adresse.ville && (
                      <>
                        <br />
                        {currentClient.adresse.codePostale} {currentClient.adresse.ville}
                      </>
                    )}
                    {currentClient.adresse.pays && (
                      <>
                        <br />
                        {currentClient.adresse.pays}
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Statistiques
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {clientCommandes.length}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Commandes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {calculateTotalCommandes().toFixed(2)} €
                    </Typography>
                    <Typography variant="body2" color="white">
                      Total Achats
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Répartition par état:
                </Typography>
                {Object.values(EtatCommande).map(etat => {
                  const count = clientCommandes.filter(cmd => cmd.etatCommande === etat).length;
                  return count > 0 ? (
                    <Box key={etat} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={etat} color={getEtatColor(etat)} size="small" />
                      <Typography variant="body2">{count}</Typography>
                    </Box>
                  ) : null;
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Historique des commandes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart />
                Historique des Commandes
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code Commande</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>État</TableCell>
                      <TableCell align="right">Nb Articles</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientCommandes.map((commande) => {
                      const total = commande.ligneCommandeClients?.reduce((sum: number, ligne: any) => {
                        return sum + (ligne.quantite * ligne.prixUnitaire || 0);
                      }, 0) || 0;

                      return (
                        <TableRow key={commande.id}>
                          <TableCell>{commande.code}</TableCell>
                          <TableCell>
                            {commande.dateCommande ? new Date(commande.dateCommande).toLocaleDateString('fr-FR') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={commande.etatCommande} 
                              color={getEtatColor(commande.etatCommande)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="right">
                            {commande.ligneCommandeClients?.length || 0}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {total.toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {clientCommandes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography color="text.secondary">Aucune commande</Typography>
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

export default ClientDetails;
