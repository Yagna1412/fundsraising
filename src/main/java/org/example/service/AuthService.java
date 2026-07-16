package org.example.service;

import org.example.dto.*;


public interface AuthService {

    AuthResponse register(
            RegisterRequest request
    );

    AuthResponse login(
            LoginRequest request
    );

}