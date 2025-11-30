import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CommandeClientDto, CommandeFournisseurDto } from '../../types';
import { commandeService } from '../../services/commandeService';

interface CommandeState {
  commandesClient: CommandeClientDto[];
  commandesFournisseur: CommandeFournisseurDto[];
  currentCommandeClient: CommandeClientDto | null;
  currentCommandeFournisseur: CommandeFournisseurDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommandeState = {
  commandesClient: [],
  commandesFournisseur: [],
  currentCommandeClient: null,
  currentCommandeFournisseur: null,
  loading: false,
  error: null,
};

export const fetchCommandesClient = createAsyncThunk('commandes/fetchCommandesClient', async (_, { rejectWithValue }) => {
  try {
    return await commandeService.findAllCommandesClient();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des commandes client');
  }
});

export const fetchCommandesFournisseur = createAsyncThunk('commandes/fetchCommandesFournisseur', async (_, { rejectWithValue }) => {
  try {
    return await commandeService.findAllCommandesFournisseur();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des commandes fournisseur');
  }
});

export const saveCommandeClient = createAsyncThunk('commandes/saveCommandeClient', async (commande: CommandeClientDto, { rejectWithValue }) => {
  try {
    return await commandeService.saveCommandeClient(commande);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de la commande client');
  }
});

export const saveCommandeFournisseur = createAsyncThunk(
  'commandes/saveCommandeFournisseur',
  async (commande: CommandeFournisseurDto, { rejectWithValue }) => {
    try {
      const response = await commandeService.saveCommandeFournisseur(commande);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de la commande fournisseur');
    }
  }
);

// Récupérer une commande client par ID
export const fetchCommandeClientById = createAsyncThunk(
  'commandes/fetchCommandeClientById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commandeService.findCommandeClientById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de la commande client');
    }
  }
);

// Récupérer une commande fournisseur par ID
export const fetchCommandeFournisseurById = createAsyncThunk(
  'commandes/fetchCommandeFournisseurById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commandeService.findCommandeFournisseurById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de la commande fournisseur');
    }
  }
);

// Mettre à jour l'état d'une commande client
export const updateEtatCommandeClient = createAsyncThunk(
  'commandes/updateEtatCommandeClient',
  async ({ id, etat }: { id: number; etat: string }, { rejectWithValue }) => {
    try {
      const response = await commandeService.updateEtatCommandeClient(id, etat);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'état');
    }
  }
);

// Mettre à jour l'état d'une commande fournisseur
export const updateEtatCommandeFournisseur = createAsyncThunk(
  'commandes/updateEtatCommandeFournisseur',
  async ({ id, etat }: { id: number; etat: string }, { rejectWithValue }) => {
    try {
      const response = await commandeService.updateEtatCommandeFournisseur(id, etat);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'état');
    }
  }
);

const commandeSlice = createSlice({
  name: 'commandes',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentCommandeClient: (state, action: PayloadAction<CommandeClientDto | null>) => { state.currentCommandeClient = action.payload; },
    setCurrentCommandeFournisseur: (state, action: PayloadAction<CommandeFournisseurDto | null>) => { state.currentCommandeFournisseur = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommandesClient.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCommandesClient.fulfilled, (state, action) => { state.loading = false; state.commandesClient = action.payload; })
      .addCase(fetchCommandesClient.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchCommandesFournisseur.fulfilled, (state, action) => { state.commandesFournisseur = action.payload; })
      .addCase(fetchCommandeClientById.fulfilled, (state, action) => { state.currentCommandeClient = action.payload; })
      .addCase(fetchCommandeFournisseurById.fulfilled, (state, action) => { state.currentCommandeFournisseur = action.payload; })
      .addCase(saveCommandeClient.fulfilled, (state, action) => {
        const index = state.commandesClient.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.commandesClient[index] = action.payload;
        else state.commandesClient.push(action.payload);
      })
      .addCase(saveCommandeFournisseur.fulfilled, (state, action) => {
        const index = state.commandesFournisseur.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.commandesFournisseur[index] = action.payload;
        else state.commandesFournisseur.push(action.payload);
      });
  },
});

export const { clearError, setCurrentCommandeClient, setCurrentCommandeFournisseur } = commandeSlice.actions;
export default commandeSlice.reducer;
