import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ArticleDto, LigneVenteDto, LigneCommandeClientDto, LigneCommandeFournisseurDto } from '../../types';
import { articleService } from '../../services/articleService';

interface ArticleState {
  articles: ArticleDto[];
  currentArticle: ArticleDto | null;
  historiqueVentes: LigneVenteDto[];
  historiqueCommandesClient: LigneCommandeClientDto[];
  historiqueCommandesFournisseur: LigneCommandeFournisseurDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  currentArticle: null,
  historiqueVentes: [],
  historiqueCommandesClient: [],
  historiqueCommandesFournisseur: [],
  loading: false,
  error: null,
};

// Thunks asynchrones
export const fetchArticles = createAsyncThunk(
  'articles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await articleService.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des articles');
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await articleService.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'article');
    }
  }
);

export const saveArticle = createAsyncThunk(
  'articles/save',
  async (article: ArticleDto, { rejectWithValue }) => {
    try {
      return await articleService.save(article);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'article');
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await articleService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'article');
    }
  }
);

export const fetchHistoriqueVentes = createAsyncThunk(
  'articles/fetchHistoriqueVentes',
  async (idArticle: number, { rejectWithValue }) => {
    try {
      return await articleService.findHistoriqueVentes(idArticle);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'historique des ventes');
    }
  }
);

export const fetchHistoriqueCommandesClient = createAsyncThunk(
  'articles/fetchHistoriqueCommandesClient',
  async (idArticle: number, { rejectWithValue }) => {
    try {
      return await articleService.findHistoriqueCommandeClient(idArticle);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'historique des commandes client');
    }
  }
);

export const fetchHistoriqueCommandesFournisseur = createAsyncThunk(
  'articles/fetchHistoriqueCommandesFournisseur',
  async (idArticle: number, { rejectWithValue }) => {
    try {
      return await articleService.findHistoriqueCommandeFournisseur(idArticle);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'historique des commandes fournisseur');
    }
  }
);

export const fetchArticlesByCategory = createAsyncThunk(
  'articles/fetchByCategory',
  async (idCategory: number, { rejectWithValue }) => {
    try {
      return await articleService.findAllArticleByIdCategory(idCategory);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des articles par catégorie');
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentArticle: (state, action: PayloadAction<ArticleDto | null>) => {
      state.currentArticle = action.payload;
    },
    updateArticleInList: (state, action: PayloadAction<ArticleDto>) => {
      const index = state.articles.findIndex(article => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    clearHistoriques: (state) => {
      state.historiqueVentes = [];
      state.historiqueCommandesClient = [];
      state.historiqueCommandesFournisseur = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<ArticleDto[]>) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<ArticleDto>) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save article
      .addCase(saveArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveArticle.fulfilled, (state, action: PayloadAction<ArticleDto>) => {
        state.loading = false;
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        } else {
          state.articles.push(action.payload);
        }
        state.currentArticle = action.payload;
      })
      .addCase(saveArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.articles = state.articles.filter(article => article.id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch historique ventes
      .addCase(fetchHistoriqueVentes.fulfilled, (state, action: PayloadAction<LigneVenteDto[]>) => {
        state.historiqueVentes = action.payload;
      })
      // Fetch historique commandes client
      .addCase(fetchHistoriqueCommandesClient.fulfilled, (state, action: PayloadAction<LigneCommandeClientDto[]>) => {
        state.historiqueCommandesClient = action.payload;
      })
      // Fetch historique commandes fournisseur
      .addCase(fetchHistoriqueCommandesFournisseur.fulfilled, (state, action: PayloadAction<LigneCommandeFournisseurDto[]>) => {
        state.historiqueCommandesFournisseur = action.payload;
      })
      // Fetch articles by category
      .addCase(fetchArticlesByCategory.fulfilled, (state, action: PayloadAction<ArticleDto[]>) => {
        state.articles = action.payload;
      });
  },
});

export const { clearError, setCurrentArticle, updateArticleInList, clearHistoriques } = articleSlice.actions;
export default articleSlice.reducer;
