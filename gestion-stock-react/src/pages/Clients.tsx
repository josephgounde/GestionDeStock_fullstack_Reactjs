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
import { fetchClients, deleteClient, setCurrentClient } from '../store/slices/clientSlice';
import { ClientDto } from '../types';
import DetailCltFrs from '../components/common/DetailCltFrs';
import Pagination from '../components/common/Pagination';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { clients, loading, error } = useAppSelector((state) => state.clients);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleEdit = (client: ClientDto) => {
    dispatch(setCurrentClient(client));
    navigate(`/nouveauclient/${client.id}`);
  };

  const handleView = (client: ClientDto) => {
    navigate(`/clients/${client.id}`);
  };

  const handleDelete = async (client: ClientDto) => {
    if (client.id) {
      try {
        await dispatch(deleteClient(client.id)).unwrap();
        dispatch(fetchClients());
      } catch (error: any) {
        setErrorMsg(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const nouveauClient = () => {
    navigate('/nouveauclient');
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
            Liste des clients
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={nouveauClient}
            sx={{ textTransform: 'none' }}
          >
            Nouveau Client
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

      {/* Liste des clients avec DetailCltFrs */}
      <Box sx={{ m: 3 }}>
        {clients.map((client) => (
          <DetailCltFrs
            key={client.id}
            clientFournisseur={client}
            origin="client"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </Box>

      {/* Pagination */}
      {clients.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination />
        </Box>
      )}
    </Box>
  );
};

export default Clients;
