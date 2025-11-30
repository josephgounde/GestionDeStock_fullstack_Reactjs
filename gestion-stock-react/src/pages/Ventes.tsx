import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add, PointOfSale, Visibility, Edit, Delete } from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchVentes } from '../store/slices/ventesSlice';
import { VentesDto } from '../types';

const Ventes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ventes, loading, error } = useAppSelector((state) => state.ventes);

  useEffect(() => {
    dispatch(fetchVentes());
  }, [dispatch]);

  const handleView = (vente: VentesDto) => {
    navigate(`/ventes/${vente.id}`);
  };

  const handleEdit = (vente: VentesDto) => {
    navigate(`/nouvellevente/${vente.id}`);
  };

  const handleDeleteClick = (vente: VentesDto) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vente "${vente.code}" ?`)) {
      // TODO: Implémenter la suppression
      console.log('Suppression de la vente:', vente.id);
    }
  };

  const calculateTotal = (vente: VentesDto) => {
    if (!vente.ligneVentes || vente.ligneVentes.length === 0) return 0;
    return vente.ligneVentes.reduce((total, ligne) => {
      return total + ((ligne.quantite || 0) * (ligne.prixUnitaire || 0));
    }, 0);
  };

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 120 },
    { 
      field: 'dateVente', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'N/A'
    },
    { 
      field: 'commentaire', 
      headerName: 'Commentaire', 
      width: 200, 
      flex: 1,
      renderCell: (params) => params.value || 'Aucun commentaire'
    },
    { 
      field: 'nbArticles', 
      headerName: 'Articles', 
      width: 100,
      renderCell: (params) => {
        const nbArticles = params.row.ligneVentes?.length || 0;
        return (
          <Chip 
            label={nbArticles} 
            size="small" 
            color={nbArticles > 0 ? 'primary' : 'default'}
          />
        );
      }
    },
    { 
      field: 'total', 
      headerName: 'Total (€)', 
      width: 120,
      renderCell: (params) => {
        const total = calculateTotal(params.row);
        return (
          <Typography variant="body2" fontWeight="bold" color="success.main">
            {total.toFixed(2)} €
          </Typography>
        );
      }
    },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 150,
      getActions: (params) => [
        <GridActionsCellItem 
          icon={<Visibility />} 
          label="Voir" 
          onClick={() => handleView(params.row)} 
          color="info" 
        />,
        <GridActionsCellItem 
          icon={<Edit />} 
          label="Modifier" 
          onClick={() => handleEdit(params.row)} 
          color="primary" 
        />,
        <GridActionsCellItem 
          icon={<Delete />} 
          label="Supprimer" 
          onClick={() => handleDeleteClick(params.row)} 
          color="error" 
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          <PointOfSale sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestion des Ventes
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate('/nouvellevente')}
        >
          Nouvelle Vente
        </Button>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'white' }}>
          <Typography variant="h6">{ventes.length}</Typography>
          <Typography variant="body2">Ventes totales</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, color: 'white' }}>
          <Typography variant="h6">
            {ventes.reduce((total, vente) => total + calculateTotal(vente), 0).toFixed(2)} €
          </Typography>
          <Typography variant="body2">Chiffre d'affaires</Typography>
        </Box>
      </Box>

      {/* Tableau des ventes */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={ventes}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Ventes;
