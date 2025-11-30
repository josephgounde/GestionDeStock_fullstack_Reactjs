import { useAppDispatch } from './redux';
import { updateArticleInList } from '../store/slices/articleSlice';
import { updateClientInList } from '../store/slices/clientSlice';
import { updateFournisseurInList } from '../store/slices/fournisseurSlice';
import { updateUtilisateurInList } from '../store/slices/utilisateurSlice';
import { photoService, SavePhotoParams } from '../services/photoService';
import { ArticleDto, ClientDto, FournisseurDto, UtilisateurDto } from '../types';

type EntityType = ArticleDto | ClientDto | FournisseurDto | UtilisateurDto;

export const usePhotoUpload = () => {
  const dispatch = useAppDispatch();

  const uploadPhotoAndUpdateStore = async (params: SavePhotoParams): Promise<EntityType | null> => {
    try {
      console.log('🔄 Début upload photo avec params:', params);
      
      const updatedEntity = await photoService.savePhoto(params);
      
      console.log('📸 Réponse du service photo:', updatedEntity);
      
      if (updatedEntity) {
        console.log(`✅ ${params.context} mis à jour avec photo:`, updatedEntity);
        console.log('🖼️ URL de la photo:', updatedEntity.photo);
        
        // Mettre à jour le store Redux selon le contexte
        switch (params.context) {
          case 'article':
            console.log('🔄 Mise à jour du store Redux pour article...');
            dispatch(updateArticleInList(updatedEntity as ArticleDto));
            console.log('✅ Store Redux mis à jour pour article');
            break;
          case 'client':
            console.log('🔄 Mise à jour du store Redux pour client...');
            dispatch(updateClientInList(updatedEntity as ClientDto));
            console.log('✅ Store Redux mis à jour pour client');
            break;
          case 'fournisseur':
            console.log('🔄 Mise à jour du store Redux pour fournisseur...');
            dispatch(updateFournisseurInList(updatedEntity as FournisseurDto));
            console.log('✅ Store Redux mis à jour pour fournisseur');
            break;
          case 'utilisateur':
            console.log('🔄 Mise à jour du store Redux pour utilisateur...');
            dispatch(updateUtilisateurInList(updatedEntity as UtilisateurDto));
            console.log('✅ Store Redux mis à jour pour utilisateur');
            break;
          default:
            console.warn('⚠️ Contexte non géré:', params.context);
        }
        
        return updatedEntity;
      } else {
        console.warn('⚠️ Aucune entité retournée par le service photo');
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'upload de la photo:', error);
      console.error('❌ Détails de l\'erreur:', (error as any).response?.data || (error as any).message);
      throw error;
    }
  };

  return { uploadPhotoAndUpdateStore };
};
