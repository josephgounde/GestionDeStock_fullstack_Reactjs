import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Save, Cancel, Info } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveArticle, fetchArticleById, setCurrentArticle } from '../store/slices/articleSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { ArticleDto, CategoryDto } from '../types';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

const ArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentArticle, loading, error } = useAppSelector((state) => state.articles);
  const { categories } = useAppSelector((state) => state.categories);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhotoAndUpdateStore } = usePhotoUpload();

  const [articleDto, setArticleDto] = useState<ArticleDto>({
    codeArticle: '',
    designation: '',
    prixUnitaireHt: 0,
    tauxTva: 0,
    prixUnitaireTtc: 0,
    category: undefined,
    photo: '',
  });

  const [categorieDto, setCategorieDto] = useState<CategoryDto>({});
  const [listeCategorie, setListeCategorie] = useState<CategoryDto[]>([]);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('/assets/product.png');

  useEffect(() => {
    // Charger les catégories
    dispatch(fetchCategories()).then((result: any) => {
      if (result.payload && Array.isArray(result.payload)) {
        setListeCategorie(result.payload);
      }
    });
    
    // Si on a un ID, charger l'article
    if (id) {
      dispatch(fetchArticleById(parseInt(id))).then((result: any) => {
        if (result.payload) {
          setArticleDto(result.payload);
          setCategorieDto(result.payload.category || {});
          if (result.payload.photo) {
            setImgUrl(result.payload.photo);
          }
        }
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Array.isArray(categories)) {
      setListeCategorie(categories);
    }
  }, [categories]);

  const calculerTTC = () => {
    if (articleDto.prixUnitaireHt && articleDto.tauxTva) {
      // prixHT + (prixHT * (tauxTVA / 100))
      const prixTtc = +articleDto.prixUnitaireHt + (+articleDto.prixUnitaireHt * (articleDto.tauxTva / 100));
      setArticleDto(prev => ({
        ...prev,
        prixUnitaireTtc: prixTtc
      }));
    }
  };

  const onFileInput = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = (event) => {
        if (fileReader.result) {
          setImgUrl(fileReader.result as string);
        }
      };
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const enregistrerArticle = async () => {
    try {
      // Assigner la catégorie sélectionnée
      const articleToSave = {
        ...articleDto,
        category: categorieDto
      };
      
      const result = await dispatch(saveArticle(articleToSave)).unwrap();
      
      // Sauvegarder la photo si elle existe
      if (result.id && result.codeArticle) {
        await savePhoto(result.id, result.codeArticle);
      } else {
        navigate('/articles');
      }
    } catch (error: any) {
      if (error.errors) {
        setErrorMsg(error.errors);
      } else {
        setErrorMsg([error.message || 'Erreur lors de la sauvegarde']);
      }
    }
  };

  const savePhoto = async (idArticle: number, titre: string) => {
    if (idArticle && titre && file) {
      try {
        // Upload de la photo et mise à jour automatique du store
        const updatedArticle = await uploadPhotoAndUpdateStore({
          id: idArticle,
          title: titre,
          context: 'article',
          file: file
        });
        
        // Mettre à jour l'article courant aussi
        if (updatedArticle) {
          dispatch(setCurrentArticle(updatedArticle));
        }
        
        navigate('/articles');
      } catch (error) {
        console.error('Erreur lors de l\'upload de la photo:', error);
        navigate('/articles');
      }
    } else {
      navigate('/articles');
    }
  };

  const cancel = () => {
    navigate('/articles');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Upload d'image - identique à Angular */}
      <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
        <Button
          onClick={handleImageClick}
          sx={{ 
            backgroundColor: 'transparent', 
            border: 'none',
            p: 0,
            '&:hover': { backgroundColor: 'transparent' }
          }}
        >
          <img 
            src={imgUrl} 
            alt="Article"
            style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => onFileInput(e.target.files)}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </Button>
      </Box>

      <hr />

      {/* Section Information de l'article */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', color: '#007bff' }}>
            <Info sx={{ mr: 1 }} />
            Information de l'article
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
          {/* Première ligne : Code Article + Désignation */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Code article"
              name="codeArticle"
              value={articleDto.codeArticle || ''}
              onChange={(e) => setArticleDto(prev => ({ ...prev, codeArticle: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Designation"
              name="designation"
              value={articleDto.designation || ''}
              onChange={(e) => setArticleDto(prev => ({ ...prev, designation: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Deuxième ligne : Prix HT + Taux TVA */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Prix unitaire HT"
              name="prixUnitaireHt"
              type="number"
              value={articleDto.prixUnitaireHt || ''}
              onChange={(e) => {
                setArticleDto(prev => ({ ...prev, prixUnitaireHt: parseFloat(e.target.value) || 0 }));
                setTimeout(calculerTTC, 0);
              }}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Taux TVA"
              name="tauxTva"
              type="number"
              value={articleDto.tauxTva || ''}
              onChange={(e) => {
                setArticleDto(prev => ({ ...prev, tauxTva: parseFloat(e.target.value) || 0 }));
                setTimeout(calculerTTC, 0);
              }}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Troisième ligne : Prix TTC + Catégorie */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Prix unitaire TTC"
              name="prixUnitaireTtc"
              type="number"
              value={articleDto.prixUnitaireTtc || ''}
              onChange={(e) => setArticleDto(prev => ({ ...prev, prixUnitaireTtc: parseFloat(e.target.value) || 0 }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <FormControl fullWidth variant="outlined">
              <Select
                value={categorieDto.id || ''}
                onChange={(e) => {
                  const selectedCategory = listeCategorie.find(cat => cat.id === e.target.value);
                  setCategorieDto(selectedCategory || {});
                }}
                displayEmpty
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px'
                  }
                }}
              >
                <MenuItem value="">
                  <em>Sélectionner une catégorie</em>
                </MenuItem>
                {Array.isArray(listeCategorie) && listeCategorie.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.code} - {cat.designation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
          onClick={enregistrerArticle}
          startIcon={<Save />}
          sx={{ textTransform: 'none' }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default ArticleForm;
