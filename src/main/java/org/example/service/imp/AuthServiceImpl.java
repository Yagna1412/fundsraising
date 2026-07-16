package org.example.service.imp;
import org.example.dto.*;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.service.AuthService;





import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
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

    @Override
    public AuthResponse syncFromJwt(Jwt jwt) {
        String email = firstNonBlank(
                jwt.getClaimAsString("email"),
                jwt.getClaimAsString("preferred_username")
        );
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Keycloak token is missing an email claim");
        }

        String fullName = firstNonBlank(
                jwt.getClaimAsString("name"),
                jwt.getClaimAsString("given_name"),
                email
        );

        User.Role role = extractRole(jwt);

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                    .role(role)
                    .memberSince(LocalDate.now())
                    .anonymousDonation(false)
                    .receiveUpdates(true)
                    .build();
        } else {
            user.setFullName(fullName);
            user.setRole(role);
        }

        user = userRepository.save(user);

        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Keycloak session synced")
                .build();
    }

    @SuppressWarnings("unchecked")
    private User.Role extractRole(Jwt jwt) {
        Object realmAccess = jwt.getClaim("realm_access");
        if (realmAccess instanceof java.util.Map<?, ?> map
                && map.get("roles") instanceof java.util.Collection<?> roles) {
            for (Object role : roles) {
                if ("ADMIN".equalsIgnoreCase(String.valueOf(role))) {
                    return User.Role.ADMIN;
                }
            }
        }
        return User.Role.USER;
    }

    private static String firstNonBlank(String... values) {
        if (values == null) return null;
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

}