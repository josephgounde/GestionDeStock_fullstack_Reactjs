import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
} from '@mui/material';
import { Save, Cancel, Info } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { saveClient, fetchClientById } from '../../store/slices/clientSlice';
import { saveFournisseur, fetchFournisseurById } from '../../store/slices/fournisseurSlice';
import { ClientDto, FournisseurDto, AdresseDto } from '../../types';
import { photoService } from '../../services/photoService';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';

interface NouveauCltFrsProps {
  origin: 'client' | 'fournisseur';
}

const NouveauCltFrs: React.FC<NouveauCltFrsProps> = ({ origin }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentClient } = useAppSelector((state) => state.clients);
  const { currentFournisseur } = useAppSelector((state) => state.fournisseurs);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhotoAndUpdateStore } = usePhotoUpload();

  const [clientFournisseur, setClientFournisseur] = useState<ClientDto | FournisseurDto>({
    nom: '',
    prenom: '',
    mail: '',
    numTel: '',
  });

  const [adresseDto, setAdresseDto] = useState<AdresseDto>({
    adresse1: '',
    adresse2: '',
    ville: '',
    codePostale: '',
    pays: '',
  });

  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('/assets/product.png');

  useEffect(() => {
    if (id) {
      if (origin === 'client') {
        dispatch(fetchClientById(parseInt(id))).then((result: any) => {
          if (result.payload) {
            setClientFournisseur(result.payload);
            setAdresseDto(result.payload.adresse || {});
            if (result.payload.photo) {
              setImgUrl(result.payload.photo);
            }
          }
        });
      } else if (origin === 'fournisseur') {
        dispatch(fetchFournisseurById(parseInt(id))).then((result: any) => {
          if (result.payload) {
            setClientFournisseur(result.payload);
            setAdresseDto(result.payload.adresse || {});
            if (result.payload.photo) {
              setImgUrl(result.payload.photo);
            }
          }
        });
      }
    }
  }, [dispatch, id, origin]);

  const onFileInput = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = (event) => {
        if (fileReader.result) {
          setImgUrl(fileReader.result as string);
        }
      };
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const mapToClient = (): ClientDto => {
    return {
      ...clientFournisseur,
      adresse: adresseDto
    };
  };

  const mapToFournisseur = (): FournisseurDto => {
    return {
      ...clientFournisseur,
      adresse: adresseDto
    };
  };

  const enregistrer = async () => {
    try {
      let result: any;
      
      if (origin === 'client') {
        result = await dispatch(saveClient(mapToClient())).unwrap();
      } else if (origin === 'fournisseur') {
        result = await dispatch(saveFournisseur(mapToFournisseur())).unwrap();
      }
      
      // Sauvegarder la photo si elle existe
      if (result && result.id && result.nom) {
        await savePhoto(result.id, result.nom);
      } else {
        cancelClick();
      }
    } catch (error: any) {
      if (error.errors) {
        setErrorMsg(error.errors);
      } else {
        setErrorMsg([error.message || 'Erreur lors de la sauvegarde']);
      }
    }
  };

  const savePhoto = async (idObject: number, titre: string) => {
    if (idObject && titre && file) {
      try {
        // Upload de la photo et mise à jour automatique du store
        const updatedEntity = await uploadPhotoAndUpdateStore({
          id: idObject,
          title: titre,
          context: origin,
          file: file
        });
        
        console.log(`${origin} mis à jour avec photo:`, updatedEntity);
        cancelClick();
      } catch (error) {
        console.error('Erreur lors de l\'upload de la photo:', error);
        cancelClick();
      }
    } else {
      cancelClick();
    }
  };

  const cancelClick = () => {
    if (origin === 'client') {
      navigate('/clients');
    } else if (origin === 'fournisseur') {
      navigate('/fournisseurs');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Upload d'image - identique à Angular */}
      <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
        <Button
          onClick={handleImageClick}
          sx={{ 
            backgroundColor: 'transparent', 
            border: 'none',
            p: 0,
            '&:hover': { backgroundColor: 'transparent' }
          }}
        >
          <img 
            src={imgUrl} 
            alt={origin}
            style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => onFileInput(e.target.files)}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </Button>
      </Box>

      <hr />

      {/* Section Information du client/fournisseur */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', color: '#007bff' }}>
            <Info sx={{ mr: 1 }} />
            Information du {origin}
          </Typography>
        </Box>

        {/* Messages d'erreur */}
        {errorMsg.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </Alert>
        )}

        {/* Formulaire - Structure identique à Angular */}
        <Box component="form">
          {/* Première ligne : Nom + Adresse 1 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Nom"
              name="nom"
              value={clientFournisseur.nom || ''}
              onChange={(e) => setClientFournisseur(prev => ({ ...prev, nom: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Adresse 1"
              name="adresse1"
              value={adresseDto.adresse1 || ''}
              onChange={(e) => setAdresseDto(prev => ({ ...prev, adresse1: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Deuxième ligne : Prénom + Adresse 2 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Prenom"
              name="prenom"
              value={clientFournisseur.prenom || ''}
              onChange={(e) => setClientFournisseur(prev => ({ ...prev, prenom: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Adresse 2"
              name="adresse2"
              value={adresseDto.adresse2 || ''}
              onChange={(e) => setAdresseDto(prev => ({ ...prev, adresse2: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Troisième ligne : Email + Ville */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="E-mail"
              name="email"
              type="email"
              value={clientFournisseur.mail || ''}
              onChange={(e) => setClientFournisseur(prev => ({ ...prev, mail: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Ville"
              name="ville"
              value={adresseDto.ville || ''}
              onChange={(e) => setAdresseDto(prev => ({ ...prev, ville: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Quatrième ligne : Téléphone + Code postal */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Telephone"
              name="numtel"
              value={clientFournisseur.numTel || ''}
              onChange={(e) => setClientFournisseur(prev => ({ ...prev, numTel: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Code postal"
              name="codepostal"
              value={adresseDto.codePostale || ''}
              onChange={(e) => setAdresseDto(prev => ({ ...prev, codePostale: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>

          {/* Cinquième ligne : Vide + Pays */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              {/* Espace vide comme dans Angular */}
            </Box>
            <TextField
              fullWidth
              placeholder="Pays"
              name="pays"
              value={adresseDto.pays || ''}
              onChange={(e) => setAdresseDto(prev => ({ ...prev, pays: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px'
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Boutons - identiques à Angular */}
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          color="error"
          onClick={cancelClick}
          startIcon={<Cancel />}
          sx={{ mr: 3, textTransform: 'none' }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={enregistrer}
          startIcon={<Save />}
          sx={{ textTransform: 'none' }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default NouveauCltFrs;
