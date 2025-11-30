import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Chip, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  SwapHoriz, 
  FilterList, 
  Refresh,
  Assessment,
  Add,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { fetchMouvements } from '../store/slices/mvtStkSlice';
import { fetchArticles } from '../store/slices/articleSlice';
import { TypeMvtStk } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MouvementsStock: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mouvements, loading, error } = useAppSelector((state) => state.mvtStk);
  const { articles } = useAppSelector((state) => state.articles);

  const [tabValue, setTabValue] = useState(0);
  const [filteredMouvements, setFilteredMouvements] = useState(mouvements);
  const [filters, setFilters] = useState({
    type: '',
    article: '',
    dateDebut: '',
    dateFin: '',
  });

  useEffect(() => {
    dispatch(fetchMouvements());
    dispatch(fetchArticles());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [mouvements, filters, tabValue]);

  const applyFilters = () => {
    let filtered = [...mouvements];

    // Filtre par onglet
    if (tabValue === 1) {
      filtered = filtered.filter(mvt => mvt.typeMvt === TypeMvtStk.ENTREE);
    } else if (tabValue === 2) {
      filtered = filtered.filter(mvt => mvt.typeMvt === TypeMvtStk.SORTIE);
    } else if (tabValue === 3) {
      filtered = filtered.filter(mvt => 
        mvt.typeMvt === TypeMvtStk.CORRECTION_POS || mvt.typeMvt === TypeMvtStk.CORRECTION_NEG
      );
    }

    // Autres filtres
    if (filters.type) {
      filtered = filtered.filter(mvt => mvt.typeMvt === filters.type);
    }
    if (filters.article) {
      filtered = filtered.filter(mvt => mvt.article?.id === parseInt(filters.article));
    }
    if (filters.dateDebut) {
      filtered = filtered.filter(mvt => 
        new Date(mvt.dateMvt || '') >= new Date(filters.dateDebut)
      );
    }
    if (filters.dateFin) {
      filtered = filtered.filter(mvt => 
        new Date(mvt.dateMvt || '') <= new Date(filters.dateFin)
      );
    }

    setFilteredMouvements(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', article: '', dateDebut: '', dateFin: '' });
  };

  const getTypeColor = (type: TypeMvtStk) => {
    switch (type) {
      case TypeMvtStk.ENTREE: return 'success';
      case TypeMvtStk.SORTIE: return 'error';
      case TypeMvtStk.CORRECTION_POS: return 'info';
      case TypeMvtStk.CORRECTION_NEG: return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: TypeMvtStk) => {
    switch (type) {
      case TypeMvtStk.ENTREE: return <TrendingUp fontSize="small" />;
      case TypeMvtStk.SORTIE: return <TrendingDown fontSize="small" />;
      default: return <SwapHoriz fontSize="small" />;
    }
  };

  const calculateStats = () => {
    const entrees = mouvements.filter(mvt => mvt.typeMvt === TypeMvtStk.ENTREE);
    const sorties = mouvements.filter(mvt => mvt.typeMvt === TypeMvtStk.SORTIE);
    const corrections = mouvements.filter(mvt => 
      mvt.typeMvt === TypeMvtStk.CORRECTION_POS || mvt.typeMvt === TypeMvtStk.CORRECTION_NEG
    );

    return {
      totalEntrees: entrees.reduce((sum, mvt) => sum + (mvt.quantite || 0), 0),
      totalSorties: sorties.reduce((sum, mvt) => sum + (mvt.quantite || 0), 0),
      totalCorrections: corrections.length,
      mouvementsRecents: mouvements.filter(mvt => {
        const mvtDate = new Date(mvt.dateMvt || '');
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return mvtDate >= weekAgo;
      }).length,
    };
  };

  const stats = calculateStats();

  const columns: GridColDef[] = [
    { 
      field: 'dateMvt', 
      headerName: 'Date', 
      width: 120, 
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'N/A'
    },
    { 
      field: 'article', 
      headerName: 'Article', 
      width: 250, 
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value?.designation || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Code: {params.value?.codeArticle || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'typeMvt', 
      headerName: 'Type', 
      width: 150, 
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getTypeColor(params.value)} 
          size="small" 
          icon={getTypeIcon(params.value)}
        />
      )
    },
    { 
      field: 'quantite', 
      headerName: 'Quantité', 
      width: 120, 
      type: 'number',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight="bold"
          color={params.row.typeMvt === TypeMvtStk.ENTREE ? 'success.main' : 
                 params.row.typeMvt === TypeMvtStk.SORTIE ? 'error.main' : 'info.main'}
        >
          {params.row.typeMvt === TypeMvtStk.ENTREE ? '+' : 
           params.row.typeMvt === TypeMvtStk.SORTIE ? '-' : '±'}
          {params.value}
        </Typography>
      )
    },
    { field: 'sourceMvt', headerName: 'Source', width: 180, flex: 1 },
  ];

  return (
    <Box>
      {/* En-tête */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment />
          Mouvements de Stock
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/nouveau-mouvement')}
          >
            Nouveau Mouvement
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => dispatch(fetchMouvements())}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/nouveau-mouvement/entree')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" fontSize="large" />
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.totalEntrees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Entrées
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                Cliquez pour nouvelle entrée
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/nouveau-mouvement/sortie')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown color="error" fontSize="large" />
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {stats.totalSorties}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sorties
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                Cliquez pour nouvelle sortie
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/nouveau-mouvement/correction')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SwapHoriz color="info" fontSize="large" />
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.totalCorrections}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Corrections
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                Cliquez pour correction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment color="primary" fontSize="large" />
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stats.mouvementsRecents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cette semaine
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Filtres
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type de mouvement</InputLabel>
                <Select
                  value={filters.type}
                  label="Type de mouvement"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value={TypeMvtStk.ENTREE}>Entrée</MenuItem>
                  <MenuItem value={TypeMvtStk.SORTIE}>Sortie</MenuItem>
                  <MenuItem value={TypeMvtStk.CORRECTION_POS}>Correction +</MenuItem>
                  <MenuItem value={TypeMvtStk.CORRECTION_NEG}>Correction -</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Article</InputLabel>
                <Select
                  value={filters.article}
                  label="Article"
                  onChange={(e) => handleFilterChange('article', e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  {articles.map((article) => (
                    <MenuItem key={article.id} value={article.id?.toString()}>
                      {article.designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Date début"
                type="date"
                value={filters.dateDebut}
                onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Date fin"
                type="date"
                value={filters.dateFin}
                onChange={(e) => handleFilterChange('dateFin', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                size="small"
              >
                Effacer
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Onglets et tableau */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Tous les mouvements" />
            <Tab label="Entrées" icon={<TrendingUp />} iconPosition="start" />
            <Tab label="Sorties" icon={<TrendingDown />} iconPosition="start" />
            <Tab label="Corrections" icon={<SwapHoriz />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid 
              rows={filteredMouvements} 
              columns={columns} 
              loading={loading} 
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                '& .MuiDataGrid-columnHeaders': { 
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #e0e0e0' 
                },
              }}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid 
              rows={filteredMouvements} 
              columns={columns} 
              loading={loading} 
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid 
              rows={filteredMouvements} 
              columns={columns} 
              loading={loading} 
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box className="data-grid-container" sx={{ height: 600 }}>
            <DataGrid 
              rows={filteredMouvements} 
              columns={columns} 
              loading={loading} 
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default MouvementsStock;
