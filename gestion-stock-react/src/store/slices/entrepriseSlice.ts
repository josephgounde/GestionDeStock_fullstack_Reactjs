import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EntrepriseDto } from '../../types';
import { entrepriseService } from '../../services/entrepriseService';

interface EntrepriseState {
  entreprises: EntrepriseDto[];
  currentEntreprise: EntrepriseDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: EntrepriseState = {
  entreprises: [],
  currentEntreprise: null,
  loading: false,
  error: null,
};

export const fetchEntreprises = createAsyncThunk('entreprises/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await entrepriseService.findAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des entreprises');
  }
});

export const fetchEntrepriseById = createAsyncThunk(
  'entreprises/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await entrepriseService.findById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'entreprise');
    }
  }
);

export const saveEntreprise = createAsyncThunk('entreprises/save', async (entreprise: EntrepriseDto, { rejectWithValue }) => {
  try {
    return await entrepriseService.save(entreprise);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'entreprise');
  }
});

export const deleteEntreprise = createAsyncThunk('entreprises/delete', async (id: number, { rejectWithValue }) => {
  try {
    await entrepriseService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'entreprise');
  }
});

// Action spéciale pour l'inscription
export const sinscrire = createAsyncThunk('entreprises/sinscrire', async (entreprise: EntrepriseDto, { rejectWithValue }) => {
  try {
    return await entrepriseService.sinscrire(entreprise);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'inscription');
  }
});

const entrepriseSlice = createSlice({
  name: 'entreprises',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentEntreprise: (state, action: PayloadAction<EntrepriseDto | null>) => { state.currentEntreprise = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntreprises.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEntreprises.fulfilled, (state, action) => { state.loading = false; state.entreprises = action.payload; })
      .addCase(fetchEntreprises.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchEntrepriseById.fulfilled, (state, action) => { state.currentEntreprise = action.payload; })
      .addCase(saveEntreprise.fulfilled, (state, action) => {
        const index = state.entreprises.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.entreprises[index] = action.payload;
        else state.entreprises.push(action.payload);
      })
      .addCase(sinscrire.fulfilled, (state, action) => {
        state.currentEntreprise = action.payload;
      })
      .addCase(deleteEntreprise.fulfilled, (state, action) => {
        state.entreprises = state.entreprises.filter(e => e.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentEntreprise } = entrepriseSlice.actions;
export default entrepriseSlice.reducer;
