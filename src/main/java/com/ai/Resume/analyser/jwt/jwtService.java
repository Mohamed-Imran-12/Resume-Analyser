package com.ai.Resume.analyser.jwt;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class jwtService {

    private  String Key ="JHGVSwerbfewgrvyutgFJUYFDVsdgv36tr3621q3342*#";

    public String generateToken(String email){
         Map<String ,Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+20*24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(Key.getBytes()),Jwts.SIG.HS256)
                .compact();

    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(Key.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T>T extractClaim(String token , Function <Claims,T> claimResolver){

        Claims claims = extractAllClaims(token);
        return  claimResolver.apply(claims);
    }

    public String getEmail(String token){
        return  extractClaim(token,Claims::getSubject);
    }

    public Date getExpiration(String token){
        return  extractClaim(token,Claims::getExpiration);
    }

    public Boolean validateToken(String  token,String email){
        return getEmail(token).equals(email) && new Date(System.currentTimeMillis()).before(getExpiration(token));
    }



}
