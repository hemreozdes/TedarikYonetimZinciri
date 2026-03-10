package com.hemreozdes.tzy_backend.securities;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;

    // Bu fonksiyon application.properties'deki düz metin SECRET'i alıp kriptografik bir anahtara dönüştürür.
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Kullanıcı başarıyla giriş yaptığında çağrılır, imzalı JWT üretip frontend'e gönderir
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    //Her request'te "bu token kime ait?" sorusunu cevaplar
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //Token doğru kişiye mi ait ve süresi geçmemiş mi, ikisini birden kontrol eder
    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username) && !isTokenExpired(token);
    }

    // Token'ın expiration tarihini bugünle karşılaştırır
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    //Token içindeki herhangi bir veriyi çekmek için genel amaçlı metod, diğer metodlar bunu kullanır
    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
