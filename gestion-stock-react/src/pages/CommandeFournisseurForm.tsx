import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveCommandeFournisseur, fetchCommandeFournisseurById } from '../store/slices/commandeSlice';
import { fetchFournisseurs } from '../store/slices/fournisseurSlice';
import { CommandeFournisseurDto, EtatCommande } from '../types';

const CommandeFournisseurForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCommandeFournisseur, loading, error } = useAppSelector((state) => state.commandes);
  const { fournisseurs } = useAppSelector((state) => state.fournisseurs);

  const [formData, setFormData] = useState<CommandeFournisseurDto>({
    code: '', dateCommande: new Date().toISOString().split('T')[0], etatCommande: EtatCommande.EN_PREPARATION,
    fournisseur: undefined, ligneCommandeFournisseurs: []
  });

  useEffect(() => {
    dispatch(fetchFournisseurs());
    
    // Charger la commande existante si on est en mode modification
    if (id) {
      dispatch(fetchCommandeFournisseurById(parseInt(id)));
    }
  }, [dispatch, id]);

  // Mettre à jour le formulaire quand la commande est chargée
  useEffect(() => {
    if (currentCommandeFournisseur && id) {
      setFormData({
        ...currentCommandeFournisseur,
        dateCommande: currentCommandeFournisseur.dateCommande 
          ? new Date(currentCommandeFournisseur.dateCommande).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [currentCommandeFournisseur, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des données avant envoi
    if (!formData.fournisseur) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    
    if (!formData.code || formData.code.trim() === '') {
      alert('Veuillez saisir un code de commande');
      return;
    }
    
    console.log('📋 Données du formulaire fournisseur avant envoi:', formData);
    
    try {
      await dispatch(saveCommandeFournisseur(formData)).unwrap();
      navigate('/commandesfournisseur');
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la commande: ' + (error.message || 'Erreur inconnue'));
    }
  };

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">{id ? 'Modifier la Commande Fournisseur' : 'Nouvelle Commande Fournisseur'}</Typography>
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
                <TextField fullWidth label="Date de Commande" name="dateCommande" type="date" value={formData.dateCommande || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fournisseur</InputLabel>
                  <Select value={formData.fournisseur?.id || ''} label="Fournisseur" onChange={(e) => {
                    const selectedFournisseur = fournisseurs.find(f => f.id === e.target.value);
                    setFormData(prev => ({ ...prev, fournisseur: selectedFournisseur }));
                  }}>
                    {fournisseurs.map((fournisseur) => (
                      <MenuItem key={fournisseur.id} value={fournisseur.id}>{fournisseur.prenom} {fournisseur.nom}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box className="form-actions">
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/commandesfournisseur')} disabled={loading}>Annuler</Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommandeFournisseurForm;
