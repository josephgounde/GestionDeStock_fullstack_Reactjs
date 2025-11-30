import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUtilisateurs, deleteUtilisateur } from '../store/slices/utilisateurSlice';
import { useRoles } from '../hooks/useRoles';

const Utilisateurs: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { utilisateurs, loading, error } = useAppSelector((state) => state.utilisateurs);
  const { canEdit, canDelete } = useRoles();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    utilisateur: { id: number; nom: string; prenom: string } | null;
  }>({ open: false, utilisateur: null });

  useEffect(() => {
    console.log('Composant: Chargement de la liste des utilisateurs...');
    dispatch(fetchUtilisateurs());
  }, [dispatch]);


  const handleDeleteClick = (id: number, nom: string, prenom: string) => {
    setDeleteDialog({
      open: true,
      utilisateur: { id, nom, prenom }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.utilisateur) return;
    
    const { id, nom, prenom } = deleteDialog.utilisateur;
    
    try {
      console.log('Composant: Tentative de suppression de l\'utilisateur ID:', id);
      
      // Ajouter un timeout pour éviter l'attente infinie
      const deletePromise = dispatch(deleteUtilisateur(id)).unwrap();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La suppression a pris trop de temps')), 15000)
      );
      
      await Promise.race([deletePromise, timeoutPromise]);
      
      console.log('Composant: Suppression réussie');
      setSuccessMessage(`L'utilisateur "${prenom} ${nom}" a été supprimé avec succès.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (error: any) {
      console.error('Composant: Erreur lors de la suppression:', error);
      
      // Afficher un message d'erreur spécifique
      if (error.message?.includes('Timeout')) {
        console.error('Composant: Timeout détecté');
      }
    } finally {
      // Toujours fermer le modal, même en cas d'erreur ou timeout
      console.log('Composant: Fermeture du modal');
      setDeleteDialog({ open: false, utilisateur: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, utilisateur: null });
  };

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'email', headerName: 'Email', width: 250, flex: 1 },
    { field: 'dateDeNaissance', headerName: 'Date de naissance', width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'N/A' },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 150,
      getActions: (params) => [
        // Voir - Toujours visible
        <GridActionsCellItem 
          icon={<Visibility />} 
          label="Voir" 
          onClick={() => navigate(`/utilisateurs/${params.id}`)} 
          color="info" 
        />,
        // Modifier - Visible seulement pour ADMIN
        ...(canEdit('users') ? [
          <GridActionsCellItem 
            icon={<Edit />} 
            label="Modifier" 
            onClick={() => navigate(`/modifierutilisateur/${params.id}`)} 
            color="primary" 
          />
        ] : []),
        // Supprimer - Visible seulement pour ADMIN
        ...(canDelete('users') ? [
          <GridActionsCellItem 
            icon={<Delete />} 
            label="Supprimer" 
            onClick={() => handleDeleteClick(params.id as number, params.row.nom, params.row.prenom)} 
            color="error" 
          />
        ] : []),
      ],
    },
  ];

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" className="page-title">Gestion des Utilisateurs</Typography>
        {canEdit('users') && (
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/nouvelutilisateur')}>
            Nouvel Utilisateur
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
      <Box className="data-grid-container">
        <DataGrid rows={utilisateurs} columns={columns} loading={loading} pageSizeOptions={[10, 25, 50]} />
      </Box>

      {/* Modal de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <strong>
              {deleteDialog.utilisateur?.prenom} {deleteDialog.utilisateur?.nom}
            </strong>{' '}
            ?
            <br />
            <br />
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Utilisateurs;
