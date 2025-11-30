package com.bouali.gestiondestock.services.impl;

import com.bouali.gestiondestock.dto.ChangerMotDePasseUtilisateurDto;
import com.bouali.gestiondestock.dto.UtilisateurDto;
import com.bouali.gestiondestock.exception.EntityNotFoundException;
import com.bouali.gestiondestock.exception.ErrorCodes;
import com.bouali.gestiondestock.exception.InvalidEntityException;
import com.bouali.gestiondestock.exception.InvalidOperationException;
import com.bouali.gestiondestock.model.Roles;
import com.bouali.gestiondestock.model.Utilisateur;
import com.bouali.gestiondestock.repository.RolesRepository;
import com.bouali.gestiondestock.repository.UtilisateurRepository;
import com.bouali.gestiondestock.services.UtilisateurService;
import com.bouali.gestiondestock.validator.UtilisateurValidator;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


@Service
@Slf4j
public class UtilisateurServiceImpl implements UtilisateurService {

  private UtilisateurRepository utilisateurRepository;
  private RolesRepository rolesRepository;
  private PasswordEncoder passwordEncoder;

  @Autowired
  public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository,
      RolesRepository rolesRepository,
      PasswordEncoder passwordEncoder) {
    this.utilisateurRepository = utilisateurRepository;
    this.rolesRepository = rolesRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public UtilisateurDto save(UtilisateurDto dto) {
    log.info("🔧 SERVICE: Début sauvegarde utilisateur");
    log.info("📋 SERVICE: Email: {}, Nom: {}, Prénom: {}", dto.getEmail(), dto.getNom(), dto.getPrenom());
    
    List<String> errors = UtilisateurValidator.validate(dto);
    if (!errors.isEmpty()) {
      log.error("❌ SERVICE: Utilisateur non valide - Erreurs: {}", errors);
      throw new InvalidEntityException("L'utilisateur n'est pas valide", ErrorCodes.UTILISATEUR_NOT_VALID, errors);
    }
    log.info("✅ SERVICE: Validation réussie");

    // Vérifier l'existence de l'email seulement pour les nouveaux utilisateurs (sans ID)
    if(dto.getId() == null && userAlreadyExists(dto.getEmail())) {
      throw new InvalidEntityException("Un autre utilisateur avec le meme email existe deja", ErrorCodes.UTILISATEUR_ALREADY_EXISTS,
          Collections.singletonList("Un autre utilisateur avec le meme email existe deja dans la BDD"));
    }

    // Encoder le mot de passe seulement s'il est fourni
    if (dto.getMoteDePasse() != null && !dto.getMoteDePasse().trim().isEmpty()) {
      dto.setMoteDePasse(passwordEncoder.encode(dto.getMoteDePasse()));
    } else if (dto.getId() != null) {
      // Pour une modification sans nouveau mot de passe, récupérer l'ancien
      UtilisateurDto existingUser = findById(dto.getId());
      dto.setMoteDePasse(existingUser.getMoteDePasse());
    }

    // Convertir le DTO en entité (sans les rôles pour éviter les problèmes de référence circulaire)
    Utilisateur utilisateur = UtilisateurDto.toEntity(dto);
    utilisateur.setRoles(null); // Temporairement null pour éviter les problèmes de cascade
    
    // Sauvegarder l'utilisateur d'abord
    Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
    
    // Gérer les rôles
    if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
      // Si c'est une modification, supprimer les anciens rôles
      if (dto.getId() != null) {
        rolesRepository.deleteByUtilisateurId(savedUtilisateur.getId());
      }
      
      List<Roles> roles = dto.getRoles().stream()
          .map(roleDto -> {
            Roles role = new Roles();
            role.setRoleName(roleDto.getRoleName());
            role.setUtilisateur(savedUtilisateur); // Associer le rôle à l'utilisateur sauvegardé
            return role;
          })
          .collect(Collectors.toList());
      
      // Sauvegarder les nouveaux rôles
      rolesRepository.saveAll(roles);
      
      // Mettre à jour l'utilisateur avec ses rôles
      savedUtilisateur.setRoles(roles);
    }

    return UtilisateurDto.fromEntity(savedUtilisateur);
  }

  private boolean userAlreadyExists(String email) {
    Optional<Utilisateur> user = utilisateurRepository.findUtilisateurByEmail(email);
    return user.isPresent();
  }

  @Override
  public UtilisateurDto findById(Integer id) {
    if (id == null) {
      log.error("Utilisateur ID is null");
      return null;
    }
    return utilisateurRepository.findById(id)
        .map(UtilisateurDto::fromEntity)
        .orElseThrow(() -> new EntityNotFoundException(
            "Aucun utilisateur avec l'ID = " + id + " n' ete trouve dans la BDD",
            ErrorCodes.UTILISATEUR_NOT_FOUND)
        );
  }

  @Override
  public List<UtilisateurDto> findAll() {
    return utilisateurRepository.findAll().stream()
        .map(UtilisateurDto::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  public void delete(Integer id) {
    if (id == null) {
      log.error("Utilisateur ID is null");
      return;
    }
    
    log.info("🗑️ Tentative de suppression de l'utilisateur ID: {}", id);
    
    // Supprimer d'abord les rôles pour éviter la contrainte de clé étrangère
    log.info("🔄 Suppression des rôles pour l'utilisateur ID: {}", id);
    rolesRepository.deleteByUtilisateurId(id);
    
    // Puis supprimer l'utilisateur
    log.info("🔄 Suppression de l'utilisateur ID: {}", id);
    utilisateurRepository.deleteById(id);
    
    log.info("✅ Utilisateur ID: {} supprimé avec succès", id);
  }

  @Override
  public UtilisateurDto findByEmail(String email) {
    return utilisateurRepository.findUtilisateurByEmail(email)
        .map(UtilisateurDto::fromEntity)
        .orElseThrow(() -> new EntityNotFoundException(
        "Aucun utilisateur avec l'email = " + email + " n' ete trouve dans la BDD",
        ErrorCodes.UTILISATEUR_NOT_FOUND)
    );
  }

  @Override
  public UtilisateurDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto) {
    validate(dto);
    Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(dto.getId());
    if (utilisateurOptional.isEmpty()) {
      log.warn("Aucun utilisateur n'a ete trouve avec l'ID " + dto.getId());
      throw new EntityNotFoundException("Aucun utilisateur n'a ete trouve avec l'ID " + dto.getId(), ErrorCodes.UTILISATEUR_NOT_FOUND);
    }

    Utilisateur utilisateur = utilisateurOptional.get();
    utilisateur.setMoteDePasse(passwordEncoder.encode(dto.getMotDePasse()));

    return UtilisateurDto.fromEntity(
        utilisateurRepository.save(utilisateur)
    );
  }

  private void validate(ChangerMotDePasseUtilisateurDto dto) {
    if (dto == null) {
      log.warn("Impossible de modifier le mot de passe avec un objet NULL");
      throw new InvalidOperationException("Aucune information n'a ete fourni pour pouvoir changer le mot de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (dto.getId() == null) {
      log.warn("Impossible de modifier le mot de passe avec un ID NULL");
      throw new InvalidOperationException("ID utilisateur null:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (!StringUtils.hasLength(dto.getMotDePasse()) || !StringUtils.hasLength(dto.getConfirmMotDePasse())) {
      log.warn("Impossible de modifier le mot de passe avec un mot de passe NULL");
      throw new InvalidOperationException("Mot de passe utilisateur null:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (!dto.getMotDePasse().equals(dto.getConfirmMotDePasse())) {
      log.warn("Impossible de modifier le mot de passe avec deux mots de passe different");
      throw new InvalidOperationException("Mots de passe utilisateur non conformes:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
  }
}
