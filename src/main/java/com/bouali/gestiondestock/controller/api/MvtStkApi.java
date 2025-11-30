package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.APP_ROOT;

import com.bouali.gestiondestock.dto.MvtStkDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@Tag(name = "Mouvements de stock", description = "API pour gérer les mouvements de stock")
public interface MvtStkApi {

    @GetMapping(APP_ROOT + "/mvtstk/all")
    @Operation(summary = "Lister tous les mouvements de stock")
    @ApiResponse(responseCode = "200", description = "Liste de tous les mouvements de stock")
    List<MvtStkDto> findAll();

    @GetMapping(APP_ROOT + "/mvtstk/stockreel/{idArticle}")
    @Operation(summary = "Obtenir le stock réel d'un article")
    @ApiResponse(responseCode = "200", description = "Stock réel de l'article trouvé")
    BigDecimal stockReelArticle(@PathVariable("idArticle") Integer idArticle);

    @GetMapping(APP_ROOT + "/mvtstk/filter/article/{idArticle}")
    @Operation(summary = "Lister les mouvements de stock pour un article")
    @ApiResponse(responseCode = "200", description = "Mouvements de stock trouvés pour l'article")
    List<MvtStkDto> mvtStkArticle(@PathVariable("idArticle") Integer idArticle);

    @PostMapping(APP_ROOT + "/mvtstk/entree")
    @Operation(summary = "Enregistrer une entrée de stock")
    @ApiResponse(responseCode = "200", description = "Entrée de stock enregistrée")
    MvtStkDto entreeStock(@RequestBody MvtStkDto dto);

    @PostMapping(APP_ROOT + "/mvtstk/sortie")
    @Operation(summary = "Enregistrer une sortie de stock")
    @ApiResponse(responseCode = "200", description = "Sortie de stock enregistrée")
    MvtStkDto sortieStock(@RequestBody MvtStkDto dto);

    @PostMapping(APP_ROOT + "/mvtstk/correctionpos")
    @Operation(summary = "Corriger une entrée de stock positive")
    @ApiResponse(responseCode = "200", description = "Correction d'entrée de stock positive enregistrée")
    MvtStkDto correctionStockPos(@RequestBody MvtStkDto dto);

    @PostMapping(APP_ROOT + "/mvtstk/correctionneg")
    @Operation(summary = "Corriger une entrée de stock négative")
    @ApiResponse(responseCode = "200", description = "Correction d'entrée de stock négative enregistrée")
    MvtStkDto correctionStockNeg(@RequestBody MvtStkDto dto);

}
