import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { VentesDto } from '../../types';
import { ventesService } from '../../services/ventesService';

interface VentesState {
  ventes: VentesDto[];
  currentVente: VentesDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: VentesState = {
  ventes: [],
  currentVente: null,
  loading: false,
  error: null,
};

export const fetchVentes = createAsyncThunk('ventes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await ventesService.findAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des ventes');
  }
});

export const fetchVenteById = createAsyncThunk(
  'ventes/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ventesService.findById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de la vente');
    }
  }
);

export const fetchVenteByCode = createAsyncThunk(
  'ventes/fetchByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await ventesService.findByCode(code);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de la vente');
    }
  }
);

export const saveVente = createAsyncThunk('ventes/save', async (vente: VentesDto, { rejectWithValue }) => {
  try {
    return await ventesService.save(vente);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de la vente');
  }
});

export const deleteVente = createAsyncThunk('ventes/delete', async (id: number, { rejectWithValue }) => {
  try {
    await ventesService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de la vente');
  }
});

const ventesSlice = createSlice({
  name: 'ventes',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentVente: (state, action: PayloadAction<VentesDto | null>) => { state.currentVente = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVentes.fulfilled, (state, action) => { state.loading = false; state.ventes = action.payload; })
      .addCase(fetchVentes.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchVenteById.fulfilled, (state, action) => { state.currentVente = action.payload; })
      .addCase(fetchVenteByCode.fulfilled, (state, action) => { state.currentVente = action.payload; })
      .addCase(saveVente.fulfilled, (state, action) => {
        const index = state.ventes.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.ventes[index] = action.payload;
        else state.ventes.push(action.payload);
      })
      .addCase(deleteVente.fulfilled, (state, action) => {
        state.ventes = state.ventes.filter(v => v.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentVente } = ventesSlice.actions;
export default ventesSlice.reducer;
