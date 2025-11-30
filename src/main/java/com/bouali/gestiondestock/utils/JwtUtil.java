package com.bouali.gestiondestock.utils;

import com.bouali.gestiondestock.model.auth.ExtendedUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtil {

    private final Key key;

    // Injection de la clé depuis application.yml
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractIdEntreprise(String token) {
        return extractAllClaims(token).get("idEntreprise", String.class);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (JwtException e) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof ExtendedUser extendedUser) {
            claims.put("idEntreprise", String.valueOf(extendedUser.getIdEntreprise()));
        }
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10h
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}






//
//import com.bouali.gestiondestock.model.auth.ExtendedUser;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//@Service
//public class JwtUtil {
//
//  private String SECRET_KEY = "secret";
//
//  public String extractUsername(String token) {
//    return extractClaim(token, Claims::getSubject);
//  }
//
//  public Date extractExpiration(String token) {
//    return extractClaim(token, Claims::getExpiration);
//  }
//
//  public String extractIdEntreprise(String token) {
//    final Claims claims = extractAllClaims(token);
//
//    return claims.get("idEntreprise", String.class);
//  }
//
//  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//    final Claims claims = extractAllClaims(token);
//    return claimsResolver.apply(claims);
//  }
//
//  private Claims extractAllClaims(String token) {
//    return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
//  }
//
//  private Boolean isTokenExpired(String token) {
//    return extractExpiration(token).before(new Date());
//  }
//
//    public String generateToken(UserDetails userDetails) {
//        Map<String, Object> claims = new HashMap<>();
//
//        if (userDetails instanceof ExtendedUser extendedUser) {
//            claims.put("idEntreprise", String.valueOf(extendedUser.getIdEntreprise()));
//        }
//
//        return createToken(claims, userDetails.getUsername());
//    }
//
//
//    private String createToken(Map<String, Object> claims, String subject) {
//        return Jwts.builder()
//            .setClaims(claims)
//            .setSubject(subject)
//            .setIssuedAt(new Date(System.currentTimeMillis()))
//            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10h
//            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
//            .compact();
//    }
//
//  public Boolean validateToken(String token, UserDetails userDetails) {
//    final String username = extractUsername(token);
//    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//  }
//
//}
