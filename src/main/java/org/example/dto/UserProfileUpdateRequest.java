package org.example.dto;



import lombok.Data;

@Data
public class UserProfileUpdateRequest {

    private String fullName;

    private String phone;

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

}