package com.hemreozdes.tzy_backend.controllers;

import com.hemreozdes.tzy_backend.dtos.requests.LoginRequest;
import com.hemreozdes.tzy_backend.services.AuthService;
import com.hemreozdes.tzy_backend.dtos.responses.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
