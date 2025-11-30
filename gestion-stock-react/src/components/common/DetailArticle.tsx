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
import { Edit, Delete, Visibility, Info, AttachMoney, Flag } from '@mui/icons-material';
import { ArticleDto } from '../../types';

interface DetailArticleProps {
  articleDto: ArticleDto;
  onEdit: (article: ArticleDto) => void;
  onDelete: (article: ArticleDto) => void;
  onView: (article: ArticleDto) => void;
}

const DetailArticle: React.FC<DetailArticleProps> = ({
  articleDto,
  onEdit,
  onDelete,
  onView,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(articleDto);
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
              src={articleDto.photo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY2MEgzNVY0MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTQwIDQ1SDYwVjU1SDQwVjQ1WiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K'} 
              alt="Article"
              style={{ 
                width: '100px', 
                height: '100px',
                objectFit: 'cover'
              }}
            />
          </Grid>

          {/* Détails article */}
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
              <Typography variant="body2">{articleDto.codeArticle}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Info sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{articleDto.designation}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <AttachMoney sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{articleDto.prixUnitaireHt} €</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ color: '#007bff', fontSize: 16, mr: 1 }} />
              <Typography variant="body2">{articleDto.prixUnitaireTtc} €</Typography>
            </Box>
          </Grid>

          {/* Détails catégorie */}
          <Grid 
            item 
            xs={3} 
            sx={{ 
              borderRight: '1px solid #dee2e6',
              p: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Flag sx={{ color: '#007bff', fontSize: 20, mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {articleDto.category?.code || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {articleDto.category?.designation || 'Aucune catégorie'}
                </Typography>
              </Box>
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
              onClick={() => onEdit(articleDto)}
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
              onClick={() => onView(articleDto)}
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
            Êtes-vous sûr de vouloir supprimer cet article ?
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

export default DetailArticle;
