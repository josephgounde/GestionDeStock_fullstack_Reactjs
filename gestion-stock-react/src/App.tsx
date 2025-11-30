import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppSelector } from './hooks/redux';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Statistiques from './pages/Statistiques';
import Articles from './pages/Articles';
import ArticleForm from './pages/ArticleForm';
import ArticleDetails from './pages/ArticleDetails';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Clients from './pages/Clients';
import ClientForm from './pages/ClientForm';
import ClientDetails from './pages/ClientDetails';
import Fournisseurs from './pages/Fournisseurs';
import FournisseurForm from './pages/FournisseurForm';
import FournisseurDetails from './pages/FournisseurDetails';
import CommandesClient from './pages/CommandesClient';
import CommandeClientForm from './pages/CommandeClientForm';
import CommandeClientDetails from './pages/CommandeClientDetails';
import CommandesFournisseur from './pages/CommandesFournisseur';
import CommandeFournisseurForm from './pages/CommandeFournisseurForm';
import CommandeFournisseurDetails from './pages/CommandeFournisseurDetails';
import MouvementsStock from './pages/MouvementsStock';
import MouvementStockForm from './pages/MouvementStockForm';
import Utilisateurs from './pages/Utilisateurs';
import UtilisateurForm from './pages/UtilisateurForm';
import UtilisateurDetails from './pages/UtilisateurDetails';
import UtilisateurEdit from './pages/UtilisateurEdit';
import Profil from './pages/Profil';
import ChangerMotDePasse from './pages/ChangerMotDePasse';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';
import './App.css';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Box className="app">
      <Routes>
        {/* Routes publiques */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
        />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="statistiques" element={<Statistiques />} />
          
          {/* Articles */}
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetails />} />
          <Route path="nouvelarticle" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <ArticleForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouvelarticle/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <ArticleForm />
            </RoleProtectedRoute>
          } />
          
          {/* Catégories */}
          <Route path="categories" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <Categories />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecategorie" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CategoryForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecategorie/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CategoryForm />
            </RoleProtectedRoute>
          } />
          
          {/* Clients */}
          <Route path="clients" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <Clients />
            </RoleProtectedRoute>
          } />
          <Route path="clients/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <ClientDetails />
            </RoleProtectedRoute>
          } />
          <Route path="nouveauclient" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <ClientForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouveauclient/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <ClientForm />
            </RoleProtectedRoute>
          } />
          
          {/* Fournisseurs */}
          <Route path="fournisseurs" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <Fournisseurs />
            </RoleProtectedRoute>
          } />
          <Route path="fournisseurs/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <FournisseurDetails />
            </RoleProtectedRoute>
          } />
          <Route path="nouveaufournisseur" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <FournisseurForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouveaufournisseur/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <FournisseurForm />
            </RoleProtectedRoute>
          } />
          
          {/* Commandes Client */}
          <Route path="commandesclient" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandesClient />
            </RoleProtectedRoute>
          } />
          <Route path="commandesclient/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeClientDetails />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecommandeclt" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeClientForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecommandeclt/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeClientForm />
            </RoleProtectedRoute>
          } />
          
          {/* Commandes Fournisseur */}
          <Route path="commandesfournisseur" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandesFournisseur />
            </RoleProtectedRoute>
          } />
          <Route path="commandesfournisseur/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeFournisseurDetails />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecommandefrs" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeFournisseurForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouvellecommandefrs/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <CommandeFournisseurForm />
            </RoleProtectedRoute>
          } />
          
          {/* Mouvements de stock */}
          <Route path="mvtstk" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <MouvementsStock />
            </RoleProtectedRoute>
          } />
          <Route path="mouvements-stock" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <MouvementsStock />
            </RoleProtectedRoute>
          } />
          <Route path="nouveau-mouvement" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <MouvementStockForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouveau-mouvement/:type" element={
            <RoleProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <MouvementStockForm />
            </RoleProtectedRoute>
          } />
          
          {/* Utilisateurs */}
          <Route path="utilisateurs" element={
            <RoleProtectedRoute requiredRoles={['ADMIN']}>
              <Utilisateurs />
            </RoleProtectedRoute>
          } />
          <Route path="utilisateurs/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN']}>
              <UtilisateurDetails />
            </RoleProtectedRoute>
          } />
          <Route path="nouvelutilisateur" element={
            <RoleProtectedRoute requiredRoles={['ADMIN']}>
              <UtilisateurForm />
            </RoleProtectedRoute>
          } />
          <Route path="nouvelutilisateur/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN']}>
              <UtilisateurForm />
            </RoleProtectedRoute>
          } />
          <Route path="modifierutilisateur/:id" element={
            <RoleProtectedRoute requiredRoles={['ADMIN']}>
              <UtilisateurEdit />
            </RoleProtectedRoute>
          } />
          
          {/* Profil */}
          <Route path="profil" element={<Profil />} />
          <Route path="changermotdepasse" element={<ChangerMotDePasse />} />
        </Route>
        {/* Route par défaut */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Box>
  );
}

export default App;
