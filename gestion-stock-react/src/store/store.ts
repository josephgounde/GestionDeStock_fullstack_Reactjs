import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import articleReducer from './slices/articleSlice';
import categoryReducer from './slices/categorySlice';
import clientReducer from './slices/clientSlice';
import fournisseurReducer from './slices/fournisseurSlice';
import commandeReducer from './slices/commandeSlice';
import mvtStkReducer from './slices/mvtStkSlice';
import utilisateurReducer from './slices/utilisateurSlice';
import entrepriseReducer from './slices/entrepriseSlice';
import ventesReducer from './slices/ventesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    categories: categoryReducer,
    clients: clientReducer,
    fournisseurs: fournisseurReducer,
    commandes: commandeReducer,
    utilisateurs: utilisateurReducer,
    mvtStk: mvtStkReducer,
    entreprises: entrepriseReducer,
    ventes: ventesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
