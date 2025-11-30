import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClientDto } from '../../types';
import { clientService } from '../../services/clientService';

interface ClientState {
  clients: ClientDto[];
  currentClient: ClientDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
};

// Récupérer tous les clients
export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.findAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des clients');
    }
  }
);

// Récupérer un client par ID
export const fetchClientById = createAsyncThunk(
  'clients/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await clientService.findById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement du client');
    }
  }
);

// Sauvegarder un client
export const saveClient = createAsyncThunk(
  'clients/save',
  async (client: ClientDto, { rejectWithValue }) => {
    try {
      const response = await clientService.save(client);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde du client');
    }
  }
);

// Supprimer un client
export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await clientService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du client');
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentClient: (state, action: PayloadAction<ClientDto | null>) => {
      state.currentClient = action.payload;
    },
    updateClientInList: (state, action: PayloadAction<ClientDto>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch client by ID
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.currentClient = action.payload;
      })
      // Save client
      .addCase(saveClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        } else {
          state.clients.push(action.payload);
        }
        state.currentClient = action.payload;
      })
      // Delete client
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(client => client.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentClient, updateClientInList } = clientSlice.actions;
export default clientSlice.reducer;
