import React from 'react';
import { Box, Button } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Pour l'instant, on affiche juste une pagination simple
  // qui correspond au style Angular
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        startIcon={<NavigateBefore />}
        sx={{ 
          textTransform: 'none',
          color: '#007bff',
          borderColor: '#007bff'
        }}
      >
        Précédent
      </Button>
      
      <Box sx={{ 
        px: 2, 
        py: 1, 
        backgroundColor: '#007bff', 
        color: 'white', 
        borderRadius: 1,
        fontSize: '0.875rem'
      }}>
        Page {currentPage} sur {totalPages}
      </Box>
      
      <Button
        variant="outlined"
        size="small"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        endIcon={<NavigateNext />}
        sx={{ 
          textTransform: 'none',
          color: '#007bff',
          borderColor: '#007bff'
        }}
      >
        Suivant
      </Button>
    </Box>
  );
};

export default Pagination;
