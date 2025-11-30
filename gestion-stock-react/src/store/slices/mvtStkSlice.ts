import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MvtStkDto } from '../../types';
import { mvtStkService } from '../../services/mvtStkService';

interface MvtStkState {
  mouvements: MvtStkDto[];
  loading: boolean;
  error: string | null;
}

const initialState: MvtStkState = {
  mouvements: [],
  loading: false,
  error: null,
};

export const fetchMouvements = createAsyncThunk('mvtStk/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await mvtStkService.findAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des mouvements de stock');
  }
});

export const fetchMouvementsByArticle = createAsyncThunk('mvtStk/fetchByArticle', async (idArticle: number, { rejectWithValue }) => {
  try {
    return await mvtStkService.findByArticle(idArticle);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des mouvements par article');
  }
});

export const saveMouvement = createAsyncThunk('mvtStk/save', async (mouvement: MvtStkDto, { rejectWithValue }) => {
  try {
    return await mvtStkService.save(mouvement);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde du mouvement');
  }
});

export const saveEntreeStock = createAsyncThunk('mvtStk/saveEntree', async (mouvement: MvtStkDto, { rejectWithValue }) => {
  try {
    return await mvtStkService.entreeStock(mouvement);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'entrée de stock');
  }
});

export const saveSortieStock = createAsyncThunk('mvtStk/saveSortie', async (mouvement: MvtStkDto, { rejectWithValue }) => {
  try {
    return await mvtStkService.sortieStock(mouvement);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sortie de stock');
  }
});

export const saveCorrectionPos = createAsyncThunk('mvtStk/saveCorrectionPos', async (mouvement: MvtStkDto, { rejectWithValue }) => {
  try {
    return await mvtStkService.correctionStockPos(mouvement);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la correction positive');
  }
});

export const saveCorrectionNeg = createAsyncThunk('mvtStk/saveCorrectionNeg', async (mouvement: MvtStkDto, { rejectWithValue }) => {
  try {
    return await mvtStkService.correctionStockNeg(mouvement);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la correction négative');
  }
});

const mvtStkSlice = createSlice({
  name: 'mvtStk',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMouvements.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMouvements.fulfilled, (state, action) => { state.loading = false; state.mouvements = action.payload; })
      .addCase(fetchMouvements.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchMouvementsByArticle.fulfilled, (state, action) => { state.mouvements = action.payload; })
      .addCase(saveMouvement.fulfilled, (state, action) => { state.mouvements.push(action.payload); })
      .addCase(saveEntreeStock.fulfilled, (state, action) => { state.mouvements.push(action.payload); })
      .addCase(saveSortieStock.fulfilled, (state, action) => { state.mouvements.push(action.payload); })
      .addCase(saveCorrectionPos.fulfilled, (state, action) => { state.mouvements.push(action.payload); })
      .addCase(saveCorrectionNeg.fulfilled, (state, action) => { state.mouvements.push(action.payload); });
  },
});

export const { clearError } = mvtStkSlice.actions;
export default mvtStkSlice.reducer;
