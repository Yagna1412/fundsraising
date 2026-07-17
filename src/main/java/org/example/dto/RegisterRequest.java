package org.example.dto;



import jakarta.validation.constraints.*;

        import lombok.Data;
import org.example.entity.User;

@Data
public class RegisterRequest {

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    private String phone;

    @Size(min = 8)
    @NotBlank
    private String password;

    private User.Role role;

}