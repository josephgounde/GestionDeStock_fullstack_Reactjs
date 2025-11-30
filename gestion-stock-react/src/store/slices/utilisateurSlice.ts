import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UtilisateurDto } from '../../types';
import { utilisateurService } from '../../services/utilisateurService';

interface UtilisateurState {
  utilisateurs: UtilisateurDto[];
  currentUtilisateur: UtilisateurDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: UtilisateurState = {
  utilisateurs: [],
  currentUtilisateur: null,
  loading: false,
  error: null,
};

export const fetchUtilisateurs = createAsyncThunk('utilisateurs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await utilisateurService.findAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
  }
});

// Récupérer un utilisateur par ID
export const fetchUtilisateurById = createAsyncThunk(
  'utilisateurs/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await utilisateurService.findById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur');
    }
  }
);

export const saveUtilisateur = createAsyncThunk('utilisateurs/save', async (utilisateur: UtilisateurDto, { rejectWithValue }) => {
  try {
    return await utilisateurService.save(utilisateur);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
  }
});

export const deleteUtilisateur = createAsyncThunk('utilisateurs/delete', async (id: number, { rejectWithValue }) => {
  try {
    await utilisateurService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
  }
});

const utilisateurSlice = createSlice({
  name: 'utilisateurs',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentUtilisateur: (state, action: PayloadAction<UtilisateurDto | null>) => { state.currentUtilisateur = action.payload; },
    updateUtilisateurInList: (state, action: PayloadAction<UtilisateurDto>) => {
      const index = state.utilisateurs.findIndex(utilisateur => utilisateur.id === action.payload.id);
      if (index !== -1) {
        state.utilisateurs[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUtilisateurs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUtilisateurs.fulfilled, (state, action) => { state.loading = false; state.utilisateurs = action.payload; })
      .addCase(fetchUtilisateurs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // Fetch utilisateur by ID
      .addCase(fetchUtilisateurById.fulfilled, (state, action) => {
        state.currentUtilisateur = action.payload;
      })
      .addCase(saveUtilisateur.fulfilled, (state, action) => {
        const index = state.utilisateurs.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.utilisateurs[index] = action.payload;
        else state.utilisateurs.push(action.payload);
      })
      .addCase(deleteUtilisateur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUtilisateur.fulfilled, (state, action) => {
        state.loading = false;
        state.utilisateurs = state.utilisateurs.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUtilisateur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentUtilisateur, updateUtilisateurInList } = utilisateurSlice.actions;
export default utilisateurSlice.reducer;
