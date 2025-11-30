import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FournisseurDto } from '../../types';
import { fournisseurService } from '../../services/fournisseurService';

interface FournisseurState {
  fournisseurs: FournisseurDto[];
  currentFournisseur: FournisseurDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: FournisseurState = {
  fournisseurs: [],
  currentFournisseur: null,
  loading: false,
  error: null,
};

export const fetchFournisseurs = createAsyncThunk('fournisseurs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await fournisseurService.findAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des fournisseurs');
  }
});

// Récupérer un fournisseur par ID
export const fetchFournisseurById = createAsyncThunk(
  'fournisseurs/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fournisseurService.findById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement du fournisseur');
    }
  }
);

export const saveFournisseur = createAsyncThunk('fournisseurs/save', async (fournisseur: FournisseurDto, { rejectWithValue }) => {
  try {
    return await fournisseurService.save(fournisseur);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde du fournisseur');
  }
});

export const deleteFournisseur = createAsyncThunk('fournisseurs/delete', async (id: number, { rejectWithValue }) => {
  try {
    await fournisseurService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du fournisseur');
  }
});

const fournisseurSlice = createSlice({
  name: 'fournisseurs',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentFournisseur: (state, action: PayloadAction<FournisseurDto | null>) => { state.currentFournisseur = action.payload; },
    updateFournisseurInList: (state, action: PayloadAction<FournisseurDto>) => {
      const index = state.fournisseurs.findIndex(fournisseur => fournisseur.id === action.payload.id);
      if (index !== -1) {
        state.fournisseurs[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFournisseurs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFournisseurs.fulfilled, (state, action) => { state.loading = false; state.fournisseurs = action.payload; })
      .addCase(fetchFournisseurs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // Fetch fournisseur by ID
      .addCase(fetchFournisseurById.fulfilled, (state, action) => {
        state.currentFournisseur = action.payload;
      })
      .addCase(saveFournisseur.fulfilled, (state, action) => {
        const index = state.fournisseurs.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.fournisseurs[index] = action.payload;
        else state.fournisseurs.push(action.payload);
      })
      .addCase(deleteFournisseur.fulfilled, (state, action) => {
        state.fournisseurs = state.fournisseurs.filter(f => f.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentFournisseur, updateFournisseurInList } = fournisseurSlice.actions;
export default fournisseurSlice.reducer;
