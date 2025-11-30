package com.bouali.gestiondestock.services.auth;

import com.bouali.gestiondestock.model.Utilisateur;
import com.bouali.gestiondestock.model.auth.ExtendedUser;
import com.bouali.gestiondestock.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationUserDetailsService implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findUtilisateurByEmail(login)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (utilisateur.getRoles() != null) {
            utilisateur.getRoles().forEach(role ->
                authorities.add(new SimpleGrantedAuthority(role.getRoleName()))
            );
        }

        return new ExtendedUser(
            utilisateur.getEmail(),
            utilisateur.getMoteDePasse(),
            utilisateur.getEntreprise().getId(),
            authorities
        );
    }
}





//import com.bouali.gestiondestock.dto.UtilisateurDto;
//import com.bouali.gestiondestock.model.auth.ExtendedUser;
//import com.bouali.gestiondestock.services.UtilisateurService;
//import java.util.ArrayList;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class ApplicationUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private UtilisateurService service;
//
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        UtilisateurDto utilisateur = service.findByEmail(email);
//
//        if (utilisateur == null) {
//            throw new UsernameNotFoundException("Aucun utilisateur trouvé avec l'email : " + email);
//        }
//
//        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
//        utilisateur.getRoles().forEach(role ->
//            authorities.add(new SimpleGrantedAuthority(role.getRoleName()))
//        );
//
//        return new ExtendedUser(
//            utilisateur.getEmail(),
//            utilisateur.getMoteDePasse(),
//            utilisateur.getEntreprise().getId(),
//            authorities
//        );
//    }
//}
