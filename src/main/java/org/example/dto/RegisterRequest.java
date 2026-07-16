package org.example.dto;



import jakarta.validation.constraints.*;

        import lombok.Data;

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

}