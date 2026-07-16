package org.example.service;

import org.example.dto.*;
import org.springframework.security.oauth2.jwt.Jwt;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse syncFromJwt(Jwt jwt);
}