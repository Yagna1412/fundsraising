package org.example.service.imp;
import org.example.dto.*;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.service.AuthService;





import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl
        implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public AuthResponse register(
            RegisterRequest request
    ) {

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            throw new RuntimeException(
                    "Email already registered"
            );

        }


        User user = User.builder()

                .fullName(
                        request.getFullName()
                )

                .email(
                        request.getEmail()
                )

                .phone(
                        request.getPhone()
                )

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(User.Role.USER)

                .memberSince(
                        LocalDate.now()
                )

                .anonymousDonation(false)

                .receiveUpdates(true)

                .build();


        user = userRepository.save(user);


        return AuthResponse.builder()

                .userId(user.getId())

                .fullName(user.getFullName())

                .email(user.getEmail())

                .role(user.getRole())

                .message(
                        "Account created successfully"
                )

                .build();

    }


    @Override
    public AuthResponse login(
            LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(
                        request.getEmail()
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );


        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password"
            );

        }


        if (
                request.getRole() != null
                        &&
                        user.getRole() != request.getRole()
        ) {

            throw new RuntimeException(
                    "Selected role does not match this account"
            );

        }


        return AuthResponse.builder()

                .userId(user.getId())

                .fullName(user.getFullName())

                .email(user.getEmail())

                .role(user.getRole())

                .message("Login successful")

                .build();

    }

}