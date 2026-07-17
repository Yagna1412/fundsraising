package org.example.dto;

import lombok.*;
import org.example.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String userId;

    private String fullName;

    private String email;

    private User.Role role;

    private String message;
}
