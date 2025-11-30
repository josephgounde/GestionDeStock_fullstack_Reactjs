package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.APP_ROOT;

import com.flickr4java.flickr.FlickrException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Photos", description = "Gestion des photos associées aux objets du système")
public interface PhotoApi {

    @PostMapping(APP_ROOT + "/save/{id}/{title}/{context}")
    @Operation(summary = "Enregistrer une photo", description = "Enregistre une photo avec un titre et un contexte donnés.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photo enregistrée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides ou erreurs lors de l'enregistrement"),
        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    Object savePhoto(@PathVariable("context") String context,
                     @PathVariable("id") Integer id,
                     @RequestPart("file") MultipartFile photo,
                     @PathVariable("title") String title) throws IOException, FlickrException;
}
