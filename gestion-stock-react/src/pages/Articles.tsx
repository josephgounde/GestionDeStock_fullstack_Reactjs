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
import { fetchArticles, deleteArticle, setCurrentArticle } from '../store/slices/articleSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { ArticleDto } from '../types';
import DetailArticle from '../components/common/DetailArticle';
import Pagination from '../components/common/Pagination';
import { useRoles } from '../hooks/useRoles';

const Articles: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useAppSelector((state) => state.articles);
  const { canEdit } = useRoles();
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (article: ArticleDto) => {
    dispatch(setCurrentArticle(article));
    navigate(`/nouvelarticle/${article.id}`);
  };

  const handleView = (article: ArticleDto) => {
    navigate(`/articles/${article.id}`);
  };

  const handleDelete = async (article: ArticleDto) => {
    if (article.id) {
      try {
        await dispatch(deleteArticle(article.id)).unwrap();
        dispatch(fetchArticles());
      } catch (error: any) {
        setErrorMsg(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const nouvelArticle = () => {
    navigate('/nouvelarticle');
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
            Liste des articles
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          {canEdit('articles') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={nouvelArticle}
              sx={{ textTransform: 'none' }}
            >
              Nouvel Article
            </Button>
          )}
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

      {/* Liste des articles avec DetailArticle */}
      <Box sx={{ m: 3 }}>
        {articles.map((article) => (
          <DetailArticle
            key={article.id}
            articleDto={article}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </Box>

      {/* Pagination */}
      {articles.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination />
        </Box>
      )}
    </Box>
  );
};

export default Articles;
