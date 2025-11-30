import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemsInfo?: boolean;
  showFirstLastButtons?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemsInfo = true,
  showFirstLastButtons = true,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = parseInt(event.target.value);
    onPageSizeChange(newPageSize);
    // Recalculer la page actuelle pour rester dans les limites
    const newTotalPages = Math.ceil(totalItems / newPageSize);
    if (currentPage > newTotalPages) {
      onPageChange(newTotalPages);
    }
  };

  if (totalItems === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Aucun élément à afficher
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        py: 2,
        px: 1,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Informations sur les éléments */}
      {showItemsInfo && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Affichage de {startItem} à {endItem} sur {totalItems} éléments
          </Typography>
        </Box>
      )}

      {/* Contrôles de pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Sélecteur de taille de page */}
        {showPageSizeSelector && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Éléments par page:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                variant="outlined"
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Navigation avec boutons première/dernière page */}
        {showFirstLastButtons && totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              size="small"
              title="Première page"
            >
              <FirstPage />
            </IconButton>
            <IconButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size="small"
              title="Page précédente"
            >
              <NavigateBefore />
            </IconButton>
          </Box>
        )}

        {/* Pagination principale */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton={!showFirstLastButtons}
          showLastButton={!showFirstLastButtons}
          siblingCount={1}
          boundaryCount={1}
        />

        {/* Navigation avec boutons première/dernière page (suite) */}
        {showFirstLastButtons && totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="small"
              title="Page suivante"
            >
              <NavigateNext />
            </IconButton>
            <IconButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              size="small"
              title="Dernière page"
            >
              <LastPage />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Informations sur la page actuelle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} sur {totalPages}
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomPagination;
