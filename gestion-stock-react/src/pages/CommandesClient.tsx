import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, Chip } from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCommandesClient } from '../store/slices/commandeSlice';
import { EtatCommande } from '../types';

const CommandesClient: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { commandesClient, loading, error } = useAppSelector((state) => state.commandes);

  useEffect(() => {
    dispatch(fetchCommandesClient());
  }, [dispatch]);

  const getEtatColor = (etat: EtatCommande) => {
    switch (etat) {
      case EtatCommande.EN_PREPARATION: return 'warning';
      case EtatCommande.VALIDEE: return 'info';
      case EtatCommande.LIVREE: return 'success';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code Commande', width: 150 },
    { 
      field: 'dateCommande', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString('fr-FR')
    },
    { 
      field: 'client', 
      headerName: 'Client', 
      width: 200,
      renderCell: (params) => `${params.value?.prenom || ''} ${params.value?.nom || ''}`.trim()
    },
    {
      field: 'etatCommande',
      headerName: 'État',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getEtatColor(params.value)} 
          size="small" 
        />
      ),
    },
    {
      field: 'ligneCommandeClients',
      headerName: 'Nb Articles',
      width: 120,
      renderCell: (params) => params.value?.length || 0,
    },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 150,
      getActions: (params) => [
        <GridActionsCellItem icon={<Visibility />} label="Voir" onClick={() => navigate(`/commandesclient/${params.id}`)} />,
        <GridActionsCellItem icon={<Edit />} label="Modifier" onClick={() => navigate(`/nouvellecommandeclt/${params.id}`)} />,
      ],
    },
  ];

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">Commandes Client</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/nouvellecommandeclt')}>
          Nouvelle Commande
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Box className="data-grid-container">
        <DataGrid rows={commandesClient} columns={columns} loading={loading} pageSizeOptions={[10, 25, 50]} />
      </Box>
    </Box>
  );
};

export default CommandesClient;
