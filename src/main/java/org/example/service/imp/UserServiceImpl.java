package org.example.service.imp;

import org.example.dto.*;
import org.example.entity.Donation;
import org.example.entity.User;
import org.example.repository.*;
import org.example.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @Override
    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return map(user);
    }

    @Override
    public UserProfileResponse updateProfile(String userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getJobRole() != null) user.setJobRole(request.getJobRole());
        if (request.getCompany() != null) user.setCompany(request.getCompany());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getBankName() != null) user.setBankName(request.getBankName());
        if (request.getAccountNumber() != null) user.setAccountNumber(request.getAccountNumber());
        if (request.getIfscCode() != null) user.setIfscCode(request.getIfscCode());
        if (request.getAccountType() != null) user.setAccountType(request.getAccountType());
        if (request.getFavoriteCause() != null) user.setFavoriteCause(request.getFavoriteCause());
        if (request.getPreferredMonthlyBudget() != null) {
            user.setPreferredMonthlyBudget(request.getPreferredMonthlyBudget());
        }
        if (request.getAnonymousDonation() != null) {
            user.setAnonymousDonation(request.getAnonymousDonation());
        }
        if (request.getReceiveUpdates() != null) {
            user.setReceiveUpdates(request.getReceiveUpdates());
        }

        user = userRepository.save(user);
        return map(user);
    }

    private UserProfileResponse map(User user) {
        var successful = donationRepository.findByUserIdAndStatus(
                user.getId(),
                Donation.DonationStatus.SUCCESS
        );

        BigDecimal total = successful.stream()
                .map(Donation::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long campaignsSupported = successful.stream()
                .map(Donation::getCampaignId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet())
                .size();

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .address(user.getAddress())
                .jobRole(user.getJobRole())
                .company(user.getCompany())
                .experience(user.getExperience())
                .location(user.getLocation())
                .bankName(user.getBankName())
                .maskedAccountNumber(mask(user.getAccountNumber()))
                .ifscCode(user.getIfscCode())
                .accountType(user.getAccountType())
                .favoriteCause(user.getFavoriteCause())
                .preferredMonthlyBudget(user.getPreferredMonthlyBudget())
                .anonymousDonation(user.getAnonymousDonation())
                .receiveUpdates(user.getReceiveUpdates())
                .memberSince(user.getMemberSince())
                .totalDonations(total)
                .campaignsSupported(campaignsSupported)
                .build();
    }

    private String mask(String accountNumber) {
        if (accountNumber == null || accountNumber.isBlank()) {
            return null;
        }
        String clean = accountNumber.replaceAll("\\s+", "");
        if (clean.length() <= 4) {
            return clean;
        }
        return "XXXX XXXX " + clean.substring(clean.length() - 4);
    }
}
