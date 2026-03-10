package com.hemreozdes.tzy_backend.services;

import com.hemreozdes.tzy_backend.securities.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.hemreozdes.tzy_backend.dtos.requests.LoginRequest;
import com.hemreozdes.tzy_backend.dtos.responses.LoginResponse;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        String token = jwtUtil.generateToken(authentication.getName());
        return new LoginResponse(token, authentication.getName());
    }
}
