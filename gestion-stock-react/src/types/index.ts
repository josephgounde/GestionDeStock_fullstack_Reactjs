// Types pour l'authentification
export interface AuthenticationRequest {
  login?: string;
  password?: string;
}

export interface AuthenticationResponse {
  accessToken?: string;
}

// Types pour les utilisateurs
export interface UtilisateurDto {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  moteDePasse?: string; // Corrigé : "moteDePasse" avec "e" comme dans le backend
  photo?: string;
  dateDeNaissance?: string; // Le backend attend un Instant, mais on envoie une string ISO
  numTel?: string;
  entreprise?: EntrepriseDto;
  adresse?: AdresseDto;
  roles?: RoleDto[];
}

export interface ChangerMotDePasseUtilisateurDto {
  id?: number;
  motDePasse?: string; // Garde "motDePasse" sans "e" car c'est différent du DTO principal
  confirmMotDePasse?: string;
}

// Types pour les entreprises
export interface EntrepriseDto {
  id?: number;
  nom?: string;
  description?: string;
  adresse?: AdresseDto;
  codeFiscal?: string;
  photo?: string;
  email?: string;
  numTel?: string;
  steWeb?: string;
}

// Types pour les adresses
export interface AdresseDto {
  id?: number;
  adresse1?: string;
  adresse2?: string;
  ville?: string;
  codePostale?: string;
  pays?: string;
}

// Types pour les rôles
export interface RoleDto {
  id?: number;
  roleName?: string;
}

// Types pour les ventes
export interface VentesDto {
  id?: number;
  code?: string;
  dateVente?: string;
  commentaire?: string;
  ligneVentes?: LigneVenteDto[];
  entreprise?: EntrepriseDto;
}

export interface LigneVenteDto {
  id?: number;
  quantite?: number;
  prixUnitaire?: number;
  article?: ArticleDto;
  vente?: VentesDto;
}

// Types pour les articles
export interface ArticleDto {
  id?: number;
  codeArticle?: string;
  designation?: string;
  prixUnitaireHt?: number;
  tauxTva?: number;
  prixUnitaireTtc?: number;
  photo?: string;
  category?: CategoryDto;
  idEntreprise?: number;
}

// Types pour les catégories
export interface CategoryDto {
  id?: number;
  code?: string;
  designation?: string;
  idEntreprise?: number;
}

// Types pour les clients
export interface ClientDto {
  id?: number;
  nom?: string;
  prenom?: string;
  adresse?: AdresseDto;
  photo?: string;
  mail?: string;
  numTel?: string;
  idEntreprise?: number;
}

// Types pour les fournisseurs
export interface FournisseurDto {
  id?: number;
  nom?: string;
  prenom?: string;
  adresse?: AdresseDto;
  photo?: string;
  mail?: string;
  numTel?: string;
  idEntreprise?: number;
}

// Types pour les commandes clients
export interface CommandeClientDto {
  id?: number;
  code?: string;
  dateCommande?: string;
  etatCommande?: EtatCommande;
  client?: ClientDto;
  idEntreprise?: number;
  ligneCommandeClients?: LigneCommandeClientDto[];
}

// Types pour les commandes fournisseurs
export interface CommandeFournisseurDto {
  id?: number;
  code?: string;
  dateCommande?: string;
  etatCommande?: EtatCommande;
  fournisseur?: FournisseurDto;
  idEntreprise?: number;
  ligneCommandeFournisseurs?: LigneCommandeFournisseurDto[];
}

// Types pour les lignes de commande
export interface LigneCommandeClientDto {
  id?: number;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  idEntreprise?: number;
  commandeClient?: CommandeClientDto;
}

export interface LigneCommandeFournisseurDto {
  id?: number;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  idEntreprise?: number;
  commandeFournisseur?: CommandeFournisseurDto;
}

// Types pour les ventes
export interface VentesDto {
  id?: number;
  code?: string;
  dateVente?: string;
  commentaire?: string;
  idEntreprise?: number;
  ligneVentes?: LigneVenteDto[];
}

export interface LigneVenteDto {
  id?: number;
  vente?: VentesDto;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  idEntreprise?: number;
}

// Types pour les mouvements de stock
export interface MvtStkDto {
  id?: number;
  dateMvt?: string;
  quantite?: number;
  article?: ArticleDto;
  typeMvt?: TypeMvtStk;
  sourceMvt?: SourceMvtStk;
  idEntreprise?: number;
}

// Énumérations
export enum EtatCommande {
  EN_PREPARATION = 'EN_PREPARATION',
  VALIDEE = 'VALIDEE',
  LIVREE = 'LIVREE'
}

export enum TypeMvtStk {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  CORRECTION_POS = 'CORRECTION_POS',
  CORRECTION_NEG = 'CORRECTION_NEG'
}

export enum SourceMvtStk {
  COMMANDE_CLIENT = 'COMMANDE_CLIENT',
  COMMANDE_FOURNISSEUR = 'COMMANDE_FOURNISSEUR',
  VENTE = 'VENTE'
}

// Types pour les erreurs
export interface ErrorDto {
  httpCode?: number;
  code?: string;
  message?: string;
  errors?: string[];
}
