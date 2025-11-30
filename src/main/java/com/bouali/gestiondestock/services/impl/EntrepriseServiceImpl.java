package com.bouali.gestiondestock.services.impl;

import com.bouali.gestiondestock.dto.EntrepriseDto;
import com.bouali.gestiondestock.dto.RolesDto;
import com.bouali.gestiondestock.dto.UtilisateurDto;
import com.bouali.gestiondestock.exception.EntityNotFoundException;
import com.bouali.gestiondestock.exception.ErrorCodes;
import com.bouali.gestiondestock.exception.InvalidEntityException;
import com.bouali.gestiondestock.model.Roles;
import com.bouali.gestiondestock.model.Utilisateur;
import com.bouali.gestiondestock.repository.EntrepriseRepository;
import com.bouali.gestiondestock.repository.RolesRepository;
import com.bouali.gestiondestock.repository.UtilisateurRepository;
import com.bouali.gestiondestock.services.EntrepriseService;
import com.bouali.gestiondestock.services.UtilisateurService;
import com.bouali.gestiondestock.validator.EntrepriseValidator;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Transactional(rollbackOn = Exception.class)
@Service
@Slf4j
public class EntrepriseServiceImpl implements EntrepriseService {

  private EntrepriseRepository entrepriseRepository;
  private UtilisateurService utilisateurService;
  private RolesRepository rolesRepository;
  private UtilisateurRepository utilisateurRepository;

  @Autowired
  public EntrepriseServiceImpl(EntrepriseRepository entrepriseRepository, UtilisateurService utilisateurService,
      RolesRepository rolesRepository, UtilisateurRepository utilisateurRepository) {
    this.entrepriseRepository = entrepriseRepository;
    this.utilisateurService = utilisateurService;
    this.rolesRepository = rolesRepository;
    this.utilisateurRepository = utilisateurRepository;
  }

  @Override
  public EntrepriseDto save(EntrepriseDto dto) {
    List<String> errors = EntrepriseValidator.validate(dto);
    if (!errors.isEmpty()) {
      log.error("Entreprise is not valid {}", dto);
      throw new InvalidEntityException("L'entreprise n'est pas valide", ErrorCodes.ENTREPRISE_NOT_VALID, errors);
    }
    EntrepriseDto savedEntreprise = EntrepriseDto.fromEntity(
        entrepriseRepository.save(EntrepriseDto.toEntity(dto))
    );

    UtilisateurDto utilisateur = fromEntreprise(savedEntreprise);

    UtilisateurDto savedUser = utilisateurService.save(utilisateur);
    log.info("✅ Utilisateur créé avec ID: {}", savedUser.getId());

    // Récupérer l'entité utilisateur pour créer le rôle
    Utilisateur utilisateurEntity = utilisateurRepository.findById(savedUser.getId())
        .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

    Roles role = new Roles();
    role.setRoleName("ADMIN");
    role.setUtilisateur(utilisateurEntity);

    rolesRepository.save(role);
    log.info("✅ Rôle ADMIN créé pour l'utilisateur ID: {}", savedUser.getId());

    // Forcer le flush pour s'assurer que les rôles sont bien sauvegardés
    rolesRepository.flush();
    log.info("✅ Flush des rôles effectué - Transaction commitée");

    return  savedEntreprise;
  }

  private UtilisateurDto fromEntreprise(EntrepriseDto dto) {
    return UtilisateurDto.builder()
        .adresse(dto.getAdresse())
        .nom(dto.getNom())
        .prenom(dto.getCodeFiscal())
        .email(dto.getEmail())
        .moteDePasse(generateRandomPassword())
        .entreprise(dto)
        .dateDeNaissance(Instant.now())
        .photo(dto.getPhoto())
        .build();
  }

  private String generateRandomPassword() {
    return "som3R@nd0mP@$$word";
  }

  @Override
  public EntrepriseDto findById(Integer id) {
    if (id == null) {
      log.error("Entreprise ID is null");
      return null;
    }
    return entrepriseRepository.findById(id)
        .map(EntrepriseDto::fromEntity)
        .orElseThrow(() -> new EntityNotFoundException(
            "Aucune entreprise avec l'ID = " + id + " n' ete trouve dans la BDD",
            ErrorCodes.ENTREPRISE_NOT_FOUND)
        );
  }

  @Override
  public List<EntrepriseDto> findAll() {
    return entrepriseRepository.findAll().stream()
        .map(EntrepriseDto::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  public void delete(Integer id) {
    if (id == null) {
      log.error("Entreprise ID is null");
      return;
    }
    entrepriseRepository.deleteById(id);
  }
}
