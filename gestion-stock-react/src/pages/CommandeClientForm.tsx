import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveCommandeClient, fetchCommandeClientById } from '../store/slices/commandeSlice';
import { fetchClients } from '../store/slices/clientSlice';
import { CommandeClientDto, EtatCommande } from '../types';

const CommandeClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCommandeClient, loading, error } = useAppSelector((state) => state.commandes);
  const { clients } = useAppSelector((state) => state.clients);

  const [formData, setFormData] = useState<CommandeClientDto>({
    code: '',
    dateCommande: new Date().toISOString().split('T')[0],
    etatCommande: EtatCommande.EN_PREPARATION,
    client: undefined,
    ligneCommandeClients: []
  });

  useEffect(() => {
    dispatch(fetchClients());
    
    // Charger la commande existante si on est en mode modification
    if (id) {
      dispatch(fetchCommandeClientById(parseInt(id)));
    }
  }, [dispatch, id]);

  // Mettre à jour le formulaire quand la commande est chargée
  useEffect(() => {
    if (currentCommandeClient && id) {
      setFormData({
        ...currentCommandeClient,
        dateCommande: currentCommandeClient.dateCommande 
          ? new Date(currentCommandeClient.dateCommande).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [currentCommandeClient, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (clientId: number) => {
    const selectedClient = clients.find(client => client.id === clientId);
    setFormData(prev => ({ ...prev, client: selectedClient }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des données avant envoi
    if (!formData.client) {
      alert('Veuillez sélectionner un client');
      return;
    }
    
    if (!formData.code || formData.code.trim() === '') {
      alert('Veuillez saisir un code de commande');
      return;
    }
    
    console.log('📋 Données du formulaire avant envoi:', formData);
    
    try {
      await dispatch(saveCommandeClient(formData)).unwrap();
      navigate('/commandesclient');
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la commande: ' + (error.message || 'Erreur inconnue'));
    }
  };

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          {id ? 'Modifier la Commande Client' : 'Nouvelle Commande Client'}
        </Typography>
      </Box>

      <Card className="form-container">
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6" className="form-section-title">Informations de la commande</Typography></Grid>
              
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Code Commande" name="code" value={formData.code || ''} onChange={handleChange} required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Date de Commande" 
                  name="dateCommande" 
                  type="date" 
                  value={formData.dateCommande || ''} 
                  onChange={handleChange} 
                  InputLabelProps={{ shrink: true }}
                  required 
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.client?.id || ''}
                    label="Client"
                    onChange={(e) => handleClientChange(e.target.value as number)}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.prenom} {client.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>État</InputLabel>
                  <Select
                    value={formData.etatCommande || EtatCommande.EN_PREPARATION}
                    label="État"
                    onChange={(e) => setFormData(prev => ({ ...prev, etatCommande: e.target.value as EtatCommande }))}
                  >
                    <MenuItem value={EtatCommande.EN_PREPARATION}>En Préparation</MenuItem>
                    <MenuItem value={EtatCommande.VALIDEE}>Validée</MenuItem>
                    <MenuItem value={EtatCommande.LIVREE}>Livrée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box className="form-actions">
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/commandesclient')} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommandeClientForm;
