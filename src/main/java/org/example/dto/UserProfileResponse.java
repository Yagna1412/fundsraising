package org.example.dto;



import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String profileImageUrl;

    private String address;

    private String jobRole;

    private String company;

    private String experience;

    private String location;

    private String bankName;

    private String maskedAccountNumber;

    private String ifscCode;

    private String accountType;

    private String favoriteCause;

    private String preferredMonthlyBudget;

    private Boolean anonymousDonation;

    private Boolean receiveUpdates;

    private LocalDate memberSince;

    private BigDecimal totalDonations;

    private long campaignsSupported;

}