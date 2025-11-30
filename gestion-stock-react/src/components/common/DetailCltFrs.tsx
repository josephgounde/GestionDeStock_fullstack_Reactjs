import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  Grid,
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Info, 
  Phone, 
  Home, 
  LocationOn, 
  Public 
} from '@mui/icons-material';
import { ClientDto, FournisseurDto } from '../../types';

interface DetailCltFrsProps {
  clientFournisseur: ClientDto | FournisseurDto;
  origin: 'client' | 'fournisseur';
  onEdit: (entity: ClientDto | FournisseurDto) => void;
  onDelete: (entity: ClientDto | FournisseurDto) => void;
  onView: (entity: ClientDto | FournisseurDto) => void;
}

const DetailCltFrs: React.FC<DetailCltFrsProps> = ({
  clientFournisseur,
  origin,
  onEdit,
  onDelete,
  onView,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(clientFournisseur);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 1, 
          mr: 0, 
          border: '1px solid #dee2e6',
          borderRadius: 0,
          boxShadow: 'none'
        }}
      >
        <Grid container sx={{ minHeight: '120px' }}>
          {/* Image */}
          <Grid 
            item 
            xs={1} 
            sx={{ 
              borderRight: '1px solid #dee2e6',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={clientFournisseur.photo || '/assets/product.png'} 
              alt={origin}
              style={{ 
                width: '100px', 
                height: '100px',
                objectFit: 'cover'
              }}
            />
          </Grid>

          {/* Détails client/fournisseur */}
          <Grid 
            item 
            xs={5} 
            sx={{ 
              borderRight: '1px solid #dee2e6',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Info sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{clientFournisseur.nom}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Info sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{clientFournisseur.prenom}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{clientFournisseur.numTel}</Typography>
            </Box>
          </Grid>

          {/* Détails adresse */}
          <Grid 
            item 
            xs={3} 
            sx={{ 
              borderRight: '1px solid #dee2e6',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Home sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">
                {clientFournisseur.adresse?.adresse1} {clientFournisseur.adresse?.adresse2}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOn sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">
                {clientFournisseur.adresse?.codePostale} {clientFournisseur.adresse?.ville}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Public sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">
                {clientFournisseur.adresse?.pays || 'France'}
              </Typography>
            </Box>
          </Grid>

          {/* Boutons d'action */}
          <Grid 
            item 
            xs={3} 
            sx={{ 
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <Button
              variant="text"
              size="small"
              startIcon={<Edit />}
              onClick={() => onEdit(clientFournisseur)}
              sx={{ 
                color: '#007bff',
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Modifier
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<Delete />}
              onClick={handleDeleteClick}
              sx={{ 
                color: '#dc3545',
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Supprimer
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<Visibility />}
              onClick={() => onView(clientFournisseur)}
              sx={{ 
                color: '#007bff',
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Détails
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce {origin} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            startIcon={<Delete />}
            sx={{ color: '#6c757d' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            startIcon={<Delete />}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailCltFrs;
