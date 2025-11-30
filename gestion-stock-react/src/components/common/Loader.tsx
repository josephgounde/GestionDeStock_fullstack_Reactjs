import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

interface LoaderProps {
  loading?: boolean;
  message?: string;
  size?: number;
  backdrop?: boolean;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  loading = true, 
  message = 'Chargement...', 
  size = 40,
  backdrop = false,
  fullScreen = false 
}) => {
  if (!loading) return null;

  const LoaderContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }),
        ...((!fullScreen && !backdrop) && {
          py: 4,
        }),
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (backdrop) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={loading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={size} />
          {message && (
            <Typography variant="body1" color="inherit" textAlign="center">
              {message}
            </Typography>
          )}
        </Box>
      </Backdrop>
    );
  }

  return LoaderContent;
};

// Composants spécialisés
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Chargement de la page...' }) => (
  <Loader loading={true} message={message} size={50} fullScreen={false} />
);

export const FullScreenLoader: React.FC<{ message?: string }> = ({ message = 'Chargement...' }) => (
  <Loader loading={true} message={message} size={60} fullScreen={true} />
);

export const BackdropLoader: React.FC<{ loading: boolean; message?: string }> = ({ loading, message = 'Traitement en cours...' }) => (
  <Loader loading={loading} message={message} size={50} backdrop={true} />
);

export const InlineLoader: React.FC<{ message?: string; size?: number }> = ({ message = 'Chargement...', size = 30 }) => (
  <Loader loading={true} message={message} size={size} />
);

export default Loader;
