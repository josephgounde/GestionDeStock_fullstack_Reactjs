package com.bouali.gestiondestock.controller;


import com.bouali.gestiondestock.controller.api.UtilisateurApi;
import com.bouali.gestiondestock.dto.ChangerMotDePasseUtilisateurDto;
import com.bouali.gestiondestock.dto.UtilisateurDto;
import com.bouali.gestiondestock.services.UtilisateurService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UtilisateurController implements UtilisateurApi {

  private UtilisateurService utilisateurService;

  @Autowired
  public UtilisateurController(UtilisateurService utilisateurService) {
    this.utilisateurService = utilisateurService;
  }

  @Override
  public UtilisateurDto save(UtilisateurDto dto) {
    log.info("🎯 CONTRÔLEUR: Réception demande création utilisateur");
    log.info("📋 CONTRÔLEUR: Données reçues - Email: {}, Nom: {}", dto.getEmail(), dto.getNom());
    log.info("🎭 CONTRÔLEUR: Rôles reçus: {}", dto.getRoles() != null ? dto.getRoles().size() : 0);
    
    try {
      UtilisateurDto result = utilisateurService.save(dto);
      log.info("✅ CONTRÔLEUR: Utilisateur créé avec succès - ID: {}", result.getId());
      return result;
    } catch (Exception e) {
      log.error("❌ CONTRÔLEUR: Erreur lors de la création: {}", e.getMessage(), e);
      throw e;
    }
  }

  @Override
  public UtilisateurDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto) {
    return utilisateurService.changerMotDePasse(dto);
  }

  @Override
  public UtilisateurDto findById(Integer id) {
    return utilisateurService.findById(id);
  }

  @Override
  public UtilisateurDto findByEmail(String email) {
    return utilisateurService.findByEmail(email);
  }

  @Override
  public List<UtilisateurDto> findAll() {
    return utilisateurService.findAll();
  }

  @Override
  public void delete(Integer id) {
    utilisateurService.delete(id);
  }
}
