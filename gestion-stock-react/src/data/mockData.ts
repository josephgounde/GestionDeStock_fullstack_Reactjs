// Données de démonstration pour la navigation sans backend

export const mockArticles = [
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
  },
  {
    id: 2,
    codeArticle: 'ART002',
    designation: 'Souris Logitech MX Master',
    prixUnitaireHt: 79.99,
    tauxTva: 20,
    prixUnitaireTtc: 95.99,
    quantiteStock: 25,
    seuilStock: 10,
    category: { id: 1, code: 'INFO', designation: 'Informatique' }
  },
  {
    id: 3,
    codeArticle: 'ART003',
    designation: 'Clavier Mécanique Corsair',
    prixUnitaireHt: 149.99,
    tauxTva: 20,
    prixUnitaireTtc: 179.99,
    quantiteStock: 8,
    seuilStock: 5,
    category: { id: 1, code: 'INFO', designation: 'Informatique' }
  }
];

export const mockClients = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    mail: 'jean.dupont@email.com',
    numTel: '0123456789',
    adresse: {
      adresse1: '123 Rue de la Paix',
      ville: 'Paris',
      codePostale: '75001',
      pays: 'France'
    }
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Marie',
    mail: 'marie.martin@email.com',
    numTel: '0987654321',
    adresse: {
      adresse1: '456 Avenue des Champs',
      ville: 'Lyon',
      codePostale: '69000',
      pays: 'France'
    }
  }
];

export const mockFournisseurs = [
  {
    id: 1,
    nom: 'TechSupply',
    prenom: 'Société',
    mail: 'contact@techsupply.com',
    numTel: '0145678901',
    adresse: {
      adresse1: '789 Boulevard Tech',
      ville: 'Marseille',
      codePostale: '13000',
      pays: 'France'
    }
  },
  {
    id: 2,
    nom: 'ElectroDistrib',
    prenom: 'SARL',
    mail: 'info@electrodistrib.fr',
    numTel: '0156789012',
    adresse: {
      adresse1: '321 Rue de l\'Industrie',
      ville: 'Toulouse',
      codePostale: '31000',
      pays: 'France'
    }
  }
];

export const mockCategories = [
  {
    id: 1,
    code: 'INFO',
    designation: 'Informatique'
  },
  {
    id: 2,
    code: 'ELEC',
    designation: 'Électronique'
  },
  {
    id: 3,
    code: 'MOBI',
    designation: 'Mobilier'
  }
];

export const mockUtilisateurs = [
  {
    id: 1,
    nom: 'Admin',
    prenom: 'Super',
    email: 'admin@gestionstock.com',
    dateDeNaissance: '1990-01-01',
    numTel: '0123456789',
    adresse: {
      adresse1: '1 Rue Admin',
      ville: 'Paris',
      codePostale: '75000',
      pays: 'France'
    }
  },
  {
    id: 2,
    nom: 'Utilisateur',
    prenom: 'Test',
    email: 'user@gestionstock.com',
    dateDeNaissance: '1995-05-15',
    numTel: '0987654321'
  }
];

export const mockCommandes = [
  {
    id: 1,
    code: 'CMD001',
    dateCommande: '2024-01-15',
    etatCommande: 'VALIDEE',
    client: mockClients[0],
    ligneCommandeClients: [
      {
        id: 1,
        article: mockArticles[0],
        quantite: 2,
        prixUnitaire: 899.99
      }
    ]
  },
  {
    id: 2,
    code: 'CMD002',
    dateCommande: '2024-01-20',
    etatCommande: 'EN_PREPARATION',
    fournisseur: mockFournisseurs[0],
    ligneCommandeFournisseurs: [
      {
        id: 1,
        article: mockArticles[1],
        quantite: 10,
        prixUnitaire: 79.99
      }
    ]
  }
];

export const mockMouvements = [
  {
    id: 1,
    dateMvt: '2024-01-10',
    quantite: 20,
    typeMvt: 'ENTREE',
    sourceMvt: 'Commande fournisseur CMD002',
    article: mockArticles[0]
  },
  {
    id: 2,
    dateMvt: '2024-01-15',
    quantite: 2,
    typeMvt: 'SORTIE',
    sourceMvt: 'Commande client CMD001',
    article: mockArticles[0]
  },
  {
    id: 3,
    dateMvt: '2024-01-18',
    quantite: 1,
    typeMvt: 'CORRECTION_POS',
    sourceMvt: 'Correction inventaire',
    article: mockArticles[2]
  }
];

// Fonction pour simuler un délai d'API
export const mockApiDelay = (data: any, delay: number = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
