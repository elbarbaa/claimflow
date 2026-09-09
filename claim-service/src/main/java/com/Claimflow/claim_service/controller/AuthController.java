package com.Claimflow.claim_service.controller;

import com.Claimflow.claim_service.dto.AuthResponse;
import com.Claimflow.claim_service.dto.LoginRequest;
import com.Claimflow.claim_service.dto.RegisterRequest;
import com.Claimflow.claim_service.model.User;
import com.Claimflow.claim_service.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.Claimflow.claim_service.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")  
    public AuthResponse register(@RequestBody RegisterRequest request) {

        User user = authService.register(request);

    
        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole().name()
            );

            return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                token
            );


    }


    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = authService.login(request);

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getRole().name(),
            token
        );
    }

}