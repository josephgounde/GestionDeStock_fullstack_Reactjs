import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  onAdd,
  showView = true,
  showEdit = true,
  showDelete = true,
  showAdd = false,
  size = 'small'
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {showAdd && onAdd && (
        <Tooltip title="Ajouter">
          <IconButton
            size={size}
            onClick={onAdd}
            color="success"
            sx={{ '&:hover': { backgroundColor: 'success.light' } }}
          >
            <Add />
          </IconButton>
        </Tooltip>
      )}
      
      {showView && onView && (
        <Tooltip title="Voir les détails">
          <IconButton
            size={size}
            onClick={onView}
            color="info"
            sx={{ '&:hover': { backgroundColor: 'info.light' } }}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      )}
      
      {showEdit && onEdit && (
        <Tooltip title="Modifier">
          <IconButton
            size={size}
            onClick={onEdit}
            color="primary"
            sx={{ '&:hover': { backgroundColor: 'primary.light' } }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
      
      {showDelete && onDelete && (
        <Tooltip title="Supprimer">
          <IconButton
            size={size}
            onClick={onDelete}
            color="error"
            sx={{ '&:hover': { backgroundColor: 'error.light' } }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ActionButtons;
