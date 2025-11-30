import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  CloudUpload,
  Image as ImageIcon,
} from '@mui/icons-material';
import { photoService, SavePhotoParams } from '../../services/photoService';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange?: (imageUrl: string) => void;
  onImageUpload?: (file: File) => void;
  context: 'article' | 'client' | 'fournisseur' | 'utilisateur' | 'entreprise';
  entityId?: number;
  entityTitle?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle';
  showUploadButton?: boolean;
  showDeleteButton?: boolean;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onImageUpload,
  context,
  entityId,
  entityTitle,
  size = 'medium',
  shape = 'square',
  showUploadButton = true,
  showDeleteButton = true,
  disabled = false,
}) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhotoAndUpdateStore } = usePhotoUpload();

  const getSizeStyles = () => {
    switch (size) {
      case 'small': return { width: 80, height: 80 };
      case 'large': return { width: 200, height: 200 };
      default: return { width: 120, height: 120 };
    }
  };

  const handleFileSelect = async (file: File) => {
    setError('');
    setLoading(true);

    try {
      // Valider le fichier
      const validation = photoService.validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Fichier invalide');
        setLoading(false);
        return;
      }

      // Créer la prévisualisation
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setPreview(imageUrl);
          onImageChange?.(imageUrl);
        }
      };
      fileReader.readAsDataURL(file);

      // Callback pour le parent
      onImageUpload?.(file);

      // Si on a un ID et un titre, sauvegarder directement
      if (entityId && entityTitle) {
        const params: SavePhotoParams = {
          id: entityId,
          file,
          title: entityTitle,
          context,
        };

        const updatedEntity = await uploadPhotoAndUpdateStore(params);
        console.log('Entité mise à jour avec photo:', updatedEntity);
        
        // Si l'entité mise à jour contient une URL de photo, l'utiliser
        if (updatedEntity && updatedEntity.photo) {
          setPreview(updatedEntity.photo);
          onImageChange?.(updatedEntity.photo);
        }
      }

    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDelete = async () => {
    if (entityId) {
      try {
        setLoading(true);
        await photoService.deletePhoto(entityId, context);
        setPreview('');
        onImageChange?.('');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    } else {
      setPreview('');
      onImageChange?.('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const sizeStyles = getSizeStyles();

  return (
    <Card sx={{ maxWidth: 300, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ textAlign: 'center' }}>
          {/* Zone d'affichage de l'image */}
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 2,
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 1,
                  borderRadius: shape === 'circle' ? '50%' : 1,
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}

            {preview ? (
              <Avatar
                src={preview}
                sx={{
                  ...sizeStyles,
                  bgcolor: 'grey.200',
                  border: dragOver ? '2px dashed #1976d2' : '1px solid #e0e0e0',
                  borderRadius: shape === 'circle' ? '50%' : 1,
                }}
              >
                <ImageIcon sx={{ fontSize: sizeStyles.width * 0.4 }} />
              </Avatar>
            ) : (
              <Box
                sx={{
                  ...sizeStyles,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: dragOver ? 'action.hover' : 'grey.100',
                  border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
                  borderRadius: shape === 'circle' ? '50%' : 1,
                  cursor: disabled ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': disabled ? {} : {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={disabled ? undefined : triggerFileInput}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <PhotoCamera sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
                  <Typography variant="caption" color="textSecondary">
                    {dragOver ? 'Déposez ici' : 'Cliquez ou glissez'}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Bouton de suppression */}
            {preview && showDeleteButton && !disabled && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }}
                onClick={handleDelete}
                size="small"
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {/* Boutons d'action */}
          {showUploadButton && !disabled && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={triggerFileInput}
                size="small"
              >
                Choisir une image
              </Button>
            </Box>
          )}

          {/* Messages d'erreur */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            disabled={disabled}
          />

          {/* Informations */}
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Formats acceptés : JPG, PNG, GIF, WebP (max 5MB)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
