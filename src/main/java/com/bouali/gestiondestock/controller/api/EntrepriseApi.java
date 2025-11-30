package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.ENTREPRISE_ENDPOINT;

import com.bouali.gestiondestock.dto.EntrepriseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@Tag(name = "Entreprises", description = "API pour la gestion des entreprises")
public interface EntrepriseApi {

    @PostMapping(ENTREPRISE_ENDPOINT + "/create")
    @Operation(summary = "Créer une entreprise")
    @ApiResponse(responseCode = "200", description = "Entreprise créée")
    EntrepriseDto save(@RequestBody EntrepriseDto dto);

    @GetMapping(ENTREPRISE_ENDPOINT + "/{idEntreprise}")
    @Operation(summary = "Rechercher une entreprise par ID")
    @ApiResponse(responseCode = "200", description = "Entreprise trouvée")
    EntrepriseDto findById(@PathVariable("idEntreprise") Integer id);

    @GetMapping(ENTREPRISE_ENDPOINT + "/all")
    @Operation(summary = "Lister toutes les entreprises")
    @ApiResponse(responseCode = "200", description = "Liste des entreprises renvoyée")
    List<EntrepriseDto> findAll();

    @DeleteMapping(ENTREPRISE_ENDPOINT + "/delete/{idEntreprise}")
    @Operation(summary = "Supprimer une entreprise par ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Entreprise supprimée"),
        @ApiResponse(responseCode = "404", description = "Entreprise non trouvée")
    })
    void delete(@PathVariable("idEntreprise") Integer id);

}
