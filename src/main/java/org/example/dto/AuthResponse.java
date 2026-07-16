package org.example.dto;
import org.example.entity.User;



import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long userId;

    private String fullName;

    private String email;

    private User.Role role;

    private String message;

}