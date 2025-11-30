import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthenticationRequest, AuthenticationResponse, UtilisateurDto } from '../../types';
import { authService } from '../../services/authService';

interface AuthState {
  user: UtilisateurDto | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!) : null,
  token: localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')!).accessToken : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// Thunks asynchrones
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: AuthenticationRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.authenticate(credentials);
      
      // Après l'authentification, récupérer les informations complètes de l'utilisateur
      if (response.accessToken && credentials.login) {
        // Stocker temporairement le token pour les appels suivants
        localStorage.setItem('accessToken', JSON.stringify(response));
        
        // Récupérer l'utilisateur complet avec son entreprise
        const user = await authService.getUserByEmail(credentials.login);
        
        return { ...response, user };
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
    }
  }
);

export const getUserByEmail = createAsyncThunk(
  'auth/getUserByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const user = await authService.getUserByEmail(email);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { id: number; motDePasse: string; confirmMotDePasse: string }, { rejectWithValue }) => {
    try {
      await authService.changePassword(passwordData);
      return 'Mot de passe modifié avec succès';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('connectedUser');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UtilisateurDto>) => {
      state.user = action.payload;
      localStorage.setItem('connectedUser', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthenticationResponse & { user?: UtilisateurDto }>) => {
        state.loading = false;
        state.token = action.payload.accessToken || null;
        state.isAuthenticated = true;
        
        // Stocker l'utilisateur s'il est présent dans la réponse
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('connectedUser', JSON.stringify(action.payload.user));
        }
        
        localStorage.setItem('accessToken', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get user by email
      .addCase(getUserByEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserByEmail.fulfilled, (state, action: PayloadAction<UtilisateurDto>) => {
        state.loading = false;
        console.log('getUserByEmail.fulfilled - Utilisateur récupéré:', action.payload);
        console.log('getUserByEmail.fulfilled - Rôles:', action.payload.roles);
        state.user = action.payload;
        localStorage.setItem('connectedUser', JSON.stringify(action.payload));
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
