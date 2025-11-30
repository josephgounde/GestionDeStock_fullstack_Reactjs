import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCategories, deleteCategory, setCurrentCategory } from '../store/slices/categorySlice';
import { CategoryDto } from '../types';
import Pagination from '../components/common/Pagination';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector((state) => state.categories);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (categoryId: number) => {
    navigate(`/nouvellecategorie/${categoryId}`);
  };

  const handleView = (category: CategoryDto) => {
    console.log('Voir catégorie:', category);
  };

  const handleDeleteClick = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete?.id) {
      try {
        await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
        dispatch(fetchCategories());
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } catch (error: any) {
        setErrorMsg(error.message || 'Erreur lors de la suppression');
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const nouvelleCategory = () => {
    navigate('/nouvellecategorie');
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
            Liste des categories
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={nouvelleCategory}
            sx={{ textTransform: 'none' }}
          >
            Nouvelle Catégorie
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

      {/* Liste des catégories avec format Angular */}
      <Box sx={{ m: 3 }}>
        {categories.map((category) => (
          <Card 
            key={category.id}
            sx={{ 
              mb: 3, 
              p: 3,
              border: '1px solid #dee2e6',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            <Grid container alignItems="center">
              <Grid item xs={3} sx={{ borderRight: '1px solid #dee2e6', pr: 2 }}>
                <Typography variant="body1">{category.code}</Typography>
              </Grid>
              <Grid item xs={4} sx={{ borderRight: '1px solid #dee2e6', px: 2 }}>
                <Typography variant="body1">{category.designation}</Typography>
              </Grid>
              <Grid item xs={5} sx={{ pl: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(category.id!)}
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
                    onClick={() => handleDeleteClick(category)}
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
                    onClick={() => handleView(category)}
                    sx={{ 
                      color: '#007bff',
                      textTransform: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Détails
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {categories.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination />
        </Box>
      )}

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
            Êtes-vous sûr de vouloir supprimer cette catégorie ?
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
    </Box>
  );
};

export default Categories;
