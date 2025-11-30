import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchFournisseurs, deleteFournisseur, setCurrentFournisseur } from '../store/slices/fournisseurSlice';
import { FournisseurDto } from '../types';
import DetailCltFrs from '../components/common/DetailCltFrs';
import Pagination from '../components/common/Pagination';

const Fournisseurs: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fournisseurs, loading, error } = useAppSelector((state) => state.fournisseurs);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    dispatch(fetchFournisseurs());
  }, [dispatch]);

  const handleEdit = (fournisseur: FournisseurDto) => {
    dispatch(setCurrentFournisseur(fournisseur));
    navigate(`/nouveaufournisseur/${fournisseur.id}`);
  };

  const handleDelete = async (fournisseur: FournisseurDto) => {
    if (fournisseur.id) {
      try {
        await dispatch(deleteFournisseur(fournisseur.id)).unwrap();
        dispatch(fetchFournisseurs());
      } catch (error: any) {
        setErrorMsg(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleView = (fournisseur: FournisseurDto) => {
    navigate(`/fournisseurs/${fournisseur.id}`);
  };

  const nouveauFournisseur = () => {
    navigate('/nouveaufournisseur');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête identique à Angular */}
      <Box sx={{ display: 'flex', m: 3 }}>
        <Box sx={{ flexGrow: 1, p: 0 }}>
          <Typography variant="h4" component="h1">
            Liste des fournisseurs
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={nouveauFournisseur}
            sx={{ textTransform: 'none' }}
          >
            Nouveau Fournisseur
          </Button>
        </Box>
      </Box>

      {/* Message d'erreur */}
      {(errorMsg || error) && (
        <Box sx={{ m: 3 }}>
          <Alert severity="error">
            {errorMsg || error}
          </Alert>
        </Box>
      )}

      {/* Liste des fournisseurs avec DetailCltFrs */}
      <Box sx={{ m: 3 }}>
        {fournisseurs.map((fournisseur) => (
          <DetailCltFrs
            key={fournisseur.id}
            clientFournisseur={fournisseur}
            origin="fournisseur"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </Box>

      {/* Pagination */}
      {fournisseurs.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination />
        </Box>
      )}
    </Box>
  );
};

export default Fournisseurs;
