import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveCategory, fetchCategoryById, setCurrentCategory } from '../store/slices/categorySlice';
import { CategoryDto } from '../types';

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCategory, loading, error } = useAppSelector((state) => state.categories);

  const [categoryDto, setCategoryDto] = useState<CategoryDto>({
    code: '',
    designation: '',
  });

  const [errorMsg, setErrorMsg] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(parseInt(id))).then((result: any) => {
        if (result.payload) {
          setCategoryDto(result.payload);
        }
      });
    }
  }, [dispatch, id]);

  const enregistrerCategory = async () => {
    try {
      await dispatch(saveCategory(categoryDto)).unwrap();
      navigate('/categories');
    } catch (error: any) {
      if (error.errors) {
        setErrorMsg(error.errors);
      } else {
        setErrorMsg([error.message || 'Erreur lors de la sauvegarde']);
      }
    }
  };

  const cancel = () => {
    navigate('/categories');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Titre simple - identique à Angular */}
      <Box sx={{ mb: 3, mt: 3 }}>
        <Typography variant="h5">
          Nouvelle categorie
        </Typography>
      </Box>

      {/* Messages d'erreur */}
      {errorMsg.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </Alert>
      )}

      {/* Formulaire - Structure identique à Angular */}
      <Box component="form">
        {/* Code catégorie */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Code category"
            name="codeCat"
            value={categoryDto.code || ''}
            onChange={(e) => setCategoryDto(prev => ({ ...prev, code: e.target.value }))}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px'
              }
            }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Description"
            name="designationCat"
            value={categoryDto.designation || ''}
            onChange={(e) => setCategoryDto(prev => ({ ...prev, designation: e.target.value }))}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px'
              }
            }}
          />
        </Box>
      </Box>

      {/* Boutons - identiques à Angular */}
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          color="error"
          onClick={cancel}
          startIcon={<Cancel />}
          sx={{ mr: 3, textTransform: 'none' }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={enregistrerCategory}
          startIcon={<Save />}
          sx={{ textTransform: 'none' }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;
