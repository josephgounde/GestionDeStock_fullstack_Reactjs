// Configuration pour le mode démonstration
export const DEMO_MODE = false;

// Données mockées simples pour éviter les erreurs
export const DEMO_DATA = {
  articles: [
    {
      id: 1,
      codeArticle: 'ART001',
      designation: 'Ordinateur Portable HP',
      prixUnitaireHt: 899.99,
      tauxTva: 20,
      prixUnitaireTtc: 1079.99,
      quantiteStock: 15,
      seuilStock: 5,
      category: { id: 1, code: 'INFO', designation: 'Informatique' }
    }
  ],
  clients: [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      mail: 'jean.dupont@email.com',
      numTel: '0123456789'
    }
  ],
  fournisseurs: [
    {
      id: 1,
      nom: 'TechSupply',
      prenom: 'Société',
      mail: 'contact@techsupply.com',
      numTel: '0145678901'
    }
  ],
  categories: [
    {
      id: 1,
      code: 'INFO',
      designation: 'Informatique'
    }
  ],
  utilisateurs: [
    {
      id: 1,
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@gestionstock.com',
      numTel: '0123456789'
    }
  ],
  commandes: [],
  mouvements: []
};

export const mockDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));
