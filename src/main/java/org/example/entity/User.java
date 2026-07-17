package org.example.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String phone;

    private String password;

    private Role role;

    private String profileImageUrl;

    private String address;

    private String jobRole;

    private String company;

    private String experience;

    private String location;

    private String bankName;

    private String accountNumber;

    private String ifscCode;

    private String accountType;

    private String favoriteCause;

    private String preferredMonthlyBudget;

    private Boolean anonymousDonation;

    private Boolean receiveUpdates;

    private LocalDate memberSince;

    public enum Role {
        USER,
        ADMIN
    }
}
