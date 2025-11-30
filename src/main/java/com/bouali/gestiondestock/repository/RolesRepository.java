package com.bouali.gestiondestock.repository;

import com.bouali.gestiondestock.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface RolesRepository extends JpaRepository<Roles, Integer> {

  @Modifying
  @Transactional
  @Query("DELETE FROM Roles r WHERE r.utilisateur.id = :utilisateurId")
  void deleteByUtilisateurId(@Param("utilisateurId") Integer utilisateurId);

}
