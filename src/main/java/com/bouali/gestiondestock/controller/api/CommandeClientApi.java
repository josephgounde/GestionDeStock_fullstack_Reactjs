package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.APP_ROOT;

import com.bouali.gestiondestock.dto.CommandeClientDto;
import com.bouali.gestiondestock.dto.LigneCommandeClientDto;
import com.bouali.gestiondestock.model.EtatCommande;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Commandes Clients", description = "API pour la gestion des commandes clients")
public interface CommandeClientApi {

    @PostMapping(APP_ROOT + "/commandesclients/create")
    @Operation(summary = "Créer une commande client")
    @ApiResponse(responseCode = "200", description = "Commande enregistrée")
    ResponseEntity<CommandeClientDto> save(@RequestBody CommandeClientDto dto);

    @PatchMapping(APP_ROOT + "/commandesclients/update/etat/{idCommande}/{etatCommande}")
    @Operation(summary = "Modifier l'état d'une commande client")
    ResponseEntity<CommandeClientDto> updateEtatCommande(
        @PathVariable("idCommande") Integer idCommande,
        @PathVariable("etatCommande") EtatCommande etatCommande);

    @PatchMapping(APP_ROOT + "/commandesclients/update/quantite/{idCommande}/{idLigneCommande}/{quantite}")
    @Operation(summary = "Modifier la quantité d'un article dans une commande")
    ResponseEntity<CommandeClientDto> updateQuantiteCommande(
        @PathVariable("idCommande") Integer idCommande,
        @PathVariable("idLigneCommande") Integer idLigneCommande,
        @PathVariable("quantite") BigDecimal quantite);

    @PatchMapping(APP_ROOT + "/commandesclients/update/client/{idCommande}/{idClient}")
    @Operation(summary = "Changer le client associé à une commande")
    ResponseEntity<CommandeClientDto> updateClient(
        @PathVariable("idCommande") Integer idCommande,
        @PathVariable("idClient") Integer idClient);

    @PatchMapping(APP_ROOT + "/commandesclients/update/article/{idCommande}/{idLigneCommande}/{idArticle}")
    @Operation(summary = "Modifier l'article d'une ligne de commande")
    ResponseEntity<CommandeClientDto> updateArticle(
        @PathVariable("idCommande") Integer idCommande,
        @PathVariable("idLigneCommande") Integer idLigneCommande,
        @PathVariable("idArticle") Integer idArticle);

    @DeleteMapping(APP_ROOT + "/commandesclients/delete/article/{idCommande}/{idLigneCommande}")
    @Operation(summary = "Supprimer un article d'une commande")
    ResponseEntity<CommandeClientDto> deleteArticle(
        @PathVariable("idCommande") Integer idCommande,
        @PathVariable("idLigneCommande") Integer idLigneCommande);

    @GetMapping(APP_ROOT + "/commandesclients/{idCommandeClient}")
    @Operation(summary = "Rechercher une commande client par ID")
    ResponseEntity<CommandeClientDto> findById(@PathVariable Integer idCommandeClient);

    @GetMapping(APP_ROOT + "/commandesclients/filter/{codeCommandeClient}")
    @Operation(summary = "Rechercher une commande client par code")
    ResponseEntity<CommandeClientDto> findByCode(@PathVariable("codeCommandeClient") String code);

    @GetMapping(APP_ROOT + "/commandesclients/all")
    @Operation(summary = "Lister toutes les commandes clients")
    ResponseEntity<List<CommandeClientDto>> findAll();

    @GetMapping(APP_ROOT + "/commandesclients/lignesCommande/{idCommande}")
    @Operation(summary = "Lister les lignes d'une commande client")
    ResponseEntity<List<LigneCommandeClientDto>> findAllLignesCommandesClientByCommandeClientId(
        @PathVariable("idCommande") Integer idCommande);

    @DeleteMapping(APP_ROOT + "/commandesclients/delete/{idCommandeClient}")
    @Operation(summary = "Supprimer une commande client")
    ResponseEntity<Void> delete(@PathVariable("idCommandeClient") Integer id);
}
