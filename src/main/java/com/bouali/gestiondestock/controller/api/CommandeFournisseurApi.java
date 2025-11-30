package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.*;

import com.bouali.gestiondestock.dto.CommandeFournisseurDto;
import com.bouali.gestiondestock.dto.LigneCommandeFournisseurDto;
import com.bouali.gestiondestock.model.EtatCommande;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@Tag(name = "Commandes Fournisseurs", description = "API pour la gestion des commandes fournisseurs")
public interface CommandeFournisseurApi {

    @PostMapping(CREATE_COMMANDE_FOURNISSEUR_ENDPOINT)
    @Operation(summary = "Créer une commande fournisseur")
    @ApiResponse(responseCode = "200", description = "Commande fournisseur enregistrée")
    CommandeFournisseurDto save(@RequestBody CommandeFournisseurDto dto);

    @PatchMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/update/etat/{idCommande}/{etatCommande}")
    @Operation(summary = "Modifier l'état d'une commande fournisseur")
    CommandeFournisseurDto updateEtatCommande(
        @PathVariable Integer idCommande,
        @PathVariable EtatCommande etatCommande);

    @PatchMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/update/quantite/{idCommande}/{idLigneCommande}/{quantite}")
    @Operation(summary = "Modifier la quantité d'un article dans une commande fournisseur")
    CommandeFournisseurDto updateQuantiteCommande(
        @PathVariable Integer idCommande,
        @PathVariable Integer idLigneCommande,
        @PathVariable BigDecimal quantite);

    @PatchMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/update/fournisseur/{idCommande}/{idFournisseur}")
    @Operation(summary = "Changer le fournisseur d'une commande")
    CommandeFournisseurDto updateFournisseur(
        @PathVariable Integer idCommande,
        @PathVariable Integer idFournisseur);

    @PatchMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/update/article/{idCommande}/{idLigneCommande}/{idArticle}")
    @Operation(summary = "Modifier l'article d'une ligne de commande")
    CommandeFournisseurDto updateArticle(
        @PathVariable Integer idCommande,
        @PathVariable Integer idLigneCommande,
        @PathVariable Integer idArticle);

    @DeleteMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/delete/article/{idCommande}/{idLigneCommande}")
    @Operation(summary = "Supprimer un article d'une commande fournisseur")
    CommandeFournisseurDto deleteArticle(
        @PathVariable Integer idCommande,
        @PathVariable Integer idLigneCommande);

    @GetMapping(FIND_COMMANDE_FOURNISSEUR_BY_ID_ENDPOINT)
    @Operation(summary = "Rechercher une commande fournisseur par ID")
    CommandeFournisseurDto findById(@PathVariable Integer idCommandeFournisseur);

    @GetMapping(FIND_COMMANDE_FOURNISSEUR_BY_CODE_ENDPOINT)
    @Operation(summary = "Rechercher une commande fournisseur par code")
    CommandeFournisseurDto findByCode(@PathVariable String codeCommandeFournisseur);

    @GetMapping(FIND_ALL_COMMANDE_FOURNISSEUR_ENDPOINT)
    @Operation(summary = "Lister toutes les commandes fournisseurs")
    List<CommandeFournisseurDto> findAll();

    @GetMapping(COMMANDE_FOURNISSEUR_ENDPOINT + "/lignesCommande/{idCommande}")
    @Operation(summary = "Lister les lignes d'une commande fournisseur")
    List<LigneCommandeFournisseurDto> findAllLignesCommandesFournisseurByCommandeFournisseurId(
        @PathVariable Integer idCommande);

    @DeleteMapping(DELETE_COMMANDE_FOURNISSEUR_ENDPOINT)
    @Operation(summary = "Supprimer une commande fournisseur")
    void delete(@PathVariable Integer idCommandeFournisseur);
}
