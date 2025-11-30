import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Edit, Visibility, ShoppingCart, LocalShipping } from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCommandesClient, fetchCommandesFournisseur } from '../store/slices/commandeSlice';
import { EtatCommande } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`commandes-tabpanel-${index}`}
      aria-labelledby={`commandes-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PageCommandesCltFrs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { commandesClient, commandesFournisseur, loading, error } = useAppSelector((state) => state.commandes);

  const [tabValue, setTabValue] = useState(() => {
    const type = searchParams.get('type');
    return type === 'fournisseur' ? 1 : 0;
  });

  useEffect(() => {
    dispatch(fetchCommandesClient());
    dispatch(fetchCommandesFournisseur());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchParams({ type: newValue === 0 ? 'client' : 'fournisseur' });
  };

  const getEtatColor = (etat: EtatCommande) => {
    switch (etat) {
      case EtatCommande.EN_PREPARATION: return 'warning';
      case EtatCommande.VALIDEE: return 'info';
      case EtatCommande.LIVREE: return 'success';
      default: return 'default';
    }
  };

  const handleViewClient = (commande: any) => {
    navigate(`/commandesclient/${commande.id}`);
  };

  const handleEditClient = (commande: any) => {
    navigate(`/nouvellecommandeclt/${commande.id}`);
  };

  const handleViewFournisseur = (commande: any) => {
    navigate(`/commandesfournisseur/${commande.id}`);
  };

  const handleEditFournisseur = (commande: any) => {
    navigate(`/nouvellecommandefrs/${commande.id}`);
  };

  const columnsClient: GridColDef[] = [
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
      field: 'actions', 
      type: 'actions', 
      headerName: 'Actions', 
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem 
          icon={<Visibility />} 
          label="Voir" 
          onClick={() => handleViewClient(params.row)} 
          color="info" 
        />,
        <GridActionsCellItem 
          icon={<Edit />} 
          label="Modifier" 
          onClick={() => handleEditClient(params.row)} 
          color="primary" 
        />,
      ],
    },
  ];

  const columnsFournisseur: GridColDef[] = [
    { field: 'code', headerName: 'Code Commande', width: 150 },
    { 
      field: 'dateCommande', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString('fr-FR')
    },
    { 
      field: 'fournisseur', 
      headerName: 'Fournisseur', 
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
      field: 'ligneCommandeFournisseurs',
      headerName: 'Nb Articles',
      width: 120,
      renderCell: (params) => params.value?.length || 0,
    },
    {
      field: 'actions', 
      type: 'actions', 
      headerName: 'Actions', 
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem 
          icon={<Visibility />} 
          label="Voir" 
          onClick={() => handleViewFournisseur(params.row)} 
          color="info" 
        />,
        <GridActionsCellItem 
          icon={<Edit />} 
          label="Modifier" 
          onClick={() => handleEditFournisseur(params.row)} 
          color="primary" 
        />,
      ],
    },
  ];

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Commandes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/nouvellecommandeclt')}
            disabled={tabValue !== 0}
          >
            Nouvelle Commande Client
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/nouvellecommandefrs')}
            disabled={tabValue !== 1}
          >
            Nouvelle Commande Fournisseur
          </Button>
        </Box>
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingCart color="primary" fontSize="large" />
              <Typography variant="h4" color="primary" fontWeight="bold">
                {commandesClient.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commandes Client
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping color="warning" fontSize="large" />
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {commandesFournisseur.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commandes Fournisseur
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {[...commandesClient, ...commandesFournisseur].filter(cmd => cmd.etatCommande === EtatCommande.LIVREE).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commandes Livrées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {[...commandesClient, ...commandesFournisseur].filter(cmd => cmd.etatCommande === EtatCommande.EN_PREPARATION).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Préparation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Onglets */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label="Commandes Client" 
              icon={<ShoppingCart />} 
              iconPosition="start"
            />
            <Tab 
              label="Commandes Fournisseur" 
              icon={<LocalShipping />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid
              rows={commandesClient}
              columns={columnsClient}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #e0e0e0',
                },
              }}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid
              rows={commandesFournisseur}
              columns={columnsFournisseur}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #e0e0e0',
                },
              }}
            />
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default PageCommandesCltFrs;
