import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Business, Visibility, Edit, Delete } from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchEntreprises } from '../store/slices/entrepriseSlice';
import { EntrepriseDto } from '../types';

const Entreprises: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { entreprises, loading, error } = useAppSelector((state) => state.entreprises);

  useEffect(() => {
    dispatch(fetchEntreprises());
  }, [dispatch]);

  const handleView = (entreprise: EntrepriseDto) => {
    navigate(`/entreprises/${entreprise.id}`);
  };

  const handleEdit = (entreprise: EntrepriseDto) => {
    navigate(`/nouvelleentreprise/${entreprise.id}`);
  };

  const handleDeleteClick = (entreprise: EntrepriseDto) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${entreprise.nom}" ?`)) {
      // TODO: Implémenter la suppression
      console.log('Suppression de l\'entreprise:', entreprise.id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 200, flex: 1 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'numTel', headerName: 'Téléphone', width: 150 },
    { field: 'codeFiscal', headerName: 'Code Fiscal', width: 150 },
    { 
      field: 'steWeb', 
      headerName: 'Site Web', 
      width: 200,
      renderCell: (params) => params.value ? (
        <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
          {params.value}
        </a>
      ) : 'N/A'
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
          <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestion des Entreprises
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate('/nouvelleentreprise')}
        >
          Nouvelle Entreprise
        </Button>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tableau des entreprises */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={entreprises}
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

export default Entreprises;
