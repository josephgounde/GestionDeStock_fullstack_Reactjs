package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.FOURNISSEUR_ENDPOINT;

import com.bouali.gestiondestock.dto.FournisseurDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@Tag(name = "Fournisseurs", description = "API pour la gestion des fournisseurs")
public interface FournisseurApi {

    @PostMapping(FOURNISSEUR_ENDPOINT + "/create")
    @Operation(summary = "Créer un fournisseur")
    @ApiResponse(responseCode = "200", description = "Fournisseur créé")
    FournisseurDto save(@RequestBody FournisseurDto dto);

    @GetMapping(FOURNISSEUR_ENDPOINT + "/{idFournisseur}")
    @Operation(summary = "Rechercher un fournisseur par ID")
    @ApiResponse(responseCode = "200", description = "Fournisseur trouvé")
    FournisseurDto findById(@PathVariable("idFournisseur") Integer id);

    @GetMapping(FOURNISSEUR_ENDPOINT + "/all")
    @Operation(summary = "Lister tous les fournisseurs")
    @ApiResponse(responseCode = "200", description = "Liste des fournisseurs renvoyée")
    List<FournisseurDto> findAll();

    @DeleteMapping(FOURNISSEUR_ENDPOINT + "/delete/{idFournisseur}")
    @Operation(summary = "Supprimer un fournisseur par ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Fournisseur supprimé"),
        @ApiResponse(responseCode = "404", description = "Fournisseur non trouvé")
    })
    void delete(@PathVariable("idFournisseur") Integer id);

}
