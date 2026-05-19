package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

import lombok.Data;


@Entity
@Table(name="user")
@Data
public class User {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Name is mandatory")
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}