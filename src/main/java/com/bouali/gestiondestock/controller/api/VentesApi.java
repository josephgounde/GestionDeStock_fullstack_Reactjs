package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.VENTES_ENDPOINT;

import com.bouali.gestiondestock.dto.VentesDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Ventes", description = "Gestion des ventes dans le système")
public interface VentesApi {

    @PostMapping(VENTES_ENDPOINT + "/create")
    @Operation(summary = "Créer une vente", description = "Permet de créer une nouvelle vente dans le système.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vente créée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    VentesDto save(@RequestBody VentesDto dto);

    @GetMapping(VENTES_ENDPOINT + "/{idVente}")
    @Operation(summary = "Obtenir une vente par ID", description = "Retourne les informations d'une vente à partir de son ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vente trouvée"),
        @ApiResponse(responseCode = "404", description = "Vente non trouvée")
    })
    VentesDto findById(@PathVariable("idVente") Integer id);

    @GetMapping(VENTES_ENDPOINT + "/{codeVente}")
    @Operation(summary = "Obtenir une vente par code", description = "Retourne les informations d'une vente à partir de son code.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vente trouvée"),
        @ApiResponse(responseCode = "404", description = "Vente non trouvée")
    })
    VentesDto findByCode(@PathVariable("codeVente") String code);

    @GetMapping(VENTES_ENDPOINT + "/all")
    @Operation(summary = "Lister toutes les ventes", description = "Retourne la liste de toutes les ventes enregistrées dans le système.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des ventes retournée"),
        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    List<VentesDto> findAll();

    @DeleteMapping(VENTES_ENDPOINT + "/delete/{idVente}")
    @Operation(summary = "Supprimer une vente", description = "Supprime une vente à partir de son ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vente supprimée avec succès"),
        @ApiResponse(responseCode = "404", description = "Vente non trouvée"),
        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    void delete(@PathVariable("idVente") Integer id);

}
