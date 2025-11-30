package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.APP_ROOT;

import com.bouali.gestiondestock.dto.CategoryDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Categories", description = "API pour la gestion des catégories")
public interface CategoryApi {

    @PostMapping(value = APP_ROOT + "/categories/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Enregistrer une catégorie", description = "Créer ou modifier une catégorie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "L'objet catégorie créé / modifié"),
        @ApiResponse(responseCode = "400", description = "L'objet catégorie n'est pas valide")
    })
    CategoryDto save(@RequestBody CategoryDto dto);

    @GetMapping(value = APP_ROOT + "/categories/{idCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher une catégorie par ID", description = "Recherche d'une catégorie dans la base par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "La catégorie a été trouvée dans la BDD"),
        @ApiResponse(responseCode = "404", description = "Aucune catégorie n'existe avec l'ID fourni")
    })
    CategoryDto findById(@PathVariable("idCategory") Integer idCategory);

    @GetMapping(value = APP_ROOT + "/categories/filter/{codeCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher une catégorie par code", description = "Recherche d'une catégorie dans la base par son code")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "La catégorie a été trouvée dans la BDD"),
        @ApiResponse(responseCode = "404", description = "Aucune catégorie n'existe avec le code fourni")
    })
    CategoryDto findByCode(@PathVariable("codeCategory") String codeCategory);

    @GetMapping(value = APP_ROOT + "/categories/all", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des catégories", description = "Renvoie la liste de toutes les catégories enregistrées")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des catégories / Liste vide")
    })
    List<CategoryDto> findAll();

    @DeleteMapping(value = APP_ROOT + "/categories/delete/{idCategory}")
    @Operation(summary = "Supprimer une catégorie", description = "Suppression d'une catégorie par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "La catégorie a été supprimée")
    })
    void delete(@PathVariable("idCategory") Integer id);
}
