package com.bouali.gestiondestock.controller.api;

import static com.bouali.gestiondestock.utils.Constants.AUTHENTICATION_ENDPOINT;

import com.bouali.gestiondestock.dto.auth.AuthenticationRequest;
import com.bouali.gestiondestock.dto.auth.AuthenticationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Authentication")
public interface AuthenticationApi {

    @PostMapping(AUTHENTICATION_ENDPOINT + "/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);

}






//package com.bouali.gestiondestock.controller.api;

//import com.bouali.gestiondestock.dto.auth.AuthenticationRequest;
//import com.bouali.gestiondestock.dto.auth.AuthenticationResponse;
//
//import io.swagger.v3.oas.annotations.tags.Tag;
//import io.swagger.v3.oas.annotations.Operation;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@Tag(name = "Authentication")
//@RequestMapping("/gestiondestock/v1/authenticate")
//public interface AuthenticationApi {
//
//    @PostMapping
//    @Operation(summary = "Authentifier un utilisateur", description = "Cette méthode permet de connecter un utilisateur et de récupérer un token JWT.")
//    ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);
//}







