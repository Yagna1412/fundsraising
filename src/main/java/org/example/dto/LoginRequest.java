package org.example.dto;

import lombok.Data;
import org.example.entity.User;



import jakarta.validation.constraints.*;

        import lombok.Data;

@Data
public class LoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private User.Role role;

}