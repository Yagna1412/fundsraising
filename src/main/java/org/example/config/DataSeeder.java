package org.example.config;

import lombok.RequiredArgsConstructor;

import org.example.entity.Campaign;
import org.example.entity.Recipient;
import org.example.entity.User;

import org.example.repository.CampaignRepository;
import org.example.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final CampaignRepository campaignRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) {

        seedUsers();

        seedCampaigns();
    }


    private void seedUsers() {

        if (!userRepository.existsByEmail(
                "user@myfundraiser.com"
        )) {

            User user = User.builder()

                    .fullName(
                            "Tirumala Yagna Prasanna"
                    )

                    .email(
                            "user@myfundraiser.com"
                    )

                    .phone(
                            "+91 98765 43210"
                    )

                    .password(
                            passwordEncoder.encode(
                                    "user12345"
                            )
                    )

                    .role(User.Role.USER)

                    .address(
                            "Hyderabad, Telangana, India"
                    )

                    .jobRole(
                            "Software Developer"
                    )

                    .company(
                            "MyFundraiser"
                    )

                    .experience(
                            "3+ Years"
                    )

                    .location(
                            "Hyderabad, India"
                    )

                    .bankName(
                            "HDFC Bank"
                    )

                    .accountNumber(
                            "123456781234"
                    )

                    .ifscCode(
                            "HDFC0001234"
                    )

                    .accountType(
                            "Savings Account"
                    )

                    .favoriteCause(
                            "Education"
                    )

                    .preferredMonthlyBudget(
                            "Rs 10,000 - Rs 20,000"
                    )

                    .anonymousDonation(true)

                    .receiveUpdates(true)

                    .memberSince(
                            LocalDate.of(
                                    2026,
                                    5,
                                    1
                            )
                    )

                    .build();


            userRepository.save(user);
        }


        if (!userRepository.existsByEmail(
                "admin@myfundraiser.com"
        )) {

            User admin = User.builder()

                    .fullName("Admin")

                    .email(
                            "admin@myfundraiser.com"
                    )

                    .password(
                            passwordEncoder.encode(
                                    "admin12345"
                            )
                    )

                    .role(User.Role.ADMIN)

                    .memberSince(
                            LocalDate.now()
                    )

                    .anonymousDonation(false)

                    .receiveUpdates(true)

                    .build();


            userRepository.save(admin);
        }
    }


    private void seedCampaigns() {

        if (campaignRepository.count() > 0) {

            return;
        }


        Campaign education = Campaign.builder()

                .title(
                        "Help Children for Education"
                )

                .cause(
                        "Education"
                )

                .shortDescription(
                        "Support school fees, books, meals, and uniforms for children."
                )

                .description(
                        "Provide quality education to underprivileged children by covering tuition fees, school supplies, uniforms, and nutritious meals. Our program reaches 500+ students across 15 schools in rural areas."
                )

                .imageUrl(
                        "/images/education.jpg"
                )

                .goalAmount(
                        new BigDecimal("50000")
                )

                .raisedAmount(
                        new BigDecimal("23000")
                )

                .duration(
                        "12 months"
                )

                .beneficiaries(
                        "500+ students"
                )

                .status(
                        Campaign.CampaignStatus.ACTIVE
                )

                .build();


        Recipient aanya = Recipient.builder()

                .name(
                        "Aanya Sharma"
                )

                .supportFor(
                        "Class 8 school fees and textbooks"
                )

                .location(
                        "Jaipur, Rajasthan"
                )

                .targetAmount(
                        new BigDecimal("12000")
                )

                .campaign(education)

                .build();


        Recipient rohan = Recipient.builder()

                .name(
                        "Rohan Kumar"
                )

                .supportFor(
                        "Uniform, transport, and exam fees"
                )

                .location(
                        "Patna, Bihar"
                )

                .targetAmount(
                        new BigDecimal("9500")
                )

                .campaign(education)

                .build();


        Recipient meena = Recipient.builder()

                .name(
                        "Meena Devi"
                )

                .supportFor(
                        "STEM learning kit and tuition support"
                )

                .location(
                        "Dharwad, Karnataka"
                )

                .targetAmount(
                        new BigDecimal("15000")
                )

                .campaign(education)

                .build();


        education.setRecipients(
                List.of(
                        aanya,
                        rohan,
                        meena
                )
        );


        campaignRepository.save(education);


        Campaign medical = Campaign.builder()

                .title(
                        "Emergency Medical Support"
                )

                .cause(
                        "Medical"
                )

                .shortDescription(
                        "Help patients needing urgent treatment and medicines."
                )

                .description(
                        "Emergency medical support for patients who need urgent care."
                )

                .imageUrl(
                        "/images/medical.jpg"
                )

                .goalAmount(
                        new BigDecimal("100000")
                )

                .raisedAmount(
                        new BigDecimal("65000")
                )

                .duration(
                        "6 months"
                )

                .beneficiaries(
                        "1000+ patients"
                )

                .status(
                        Campaign.CampaignStatus.ACTIVE
                )

                .build();


        campaignRepository.save(medical);


        Campaign disaster = Campaign.builder()

                .title(
                        "Disaster Relief Support"
                )

                .cause(
                        "Emergency"
                )

                .shortDescription(
                        "Provide food, shelter, and emergency kits to affected families."
                )

                .description(
                        "Immediate disaster relief support for affected communities."
                )

                .imageUrl(
                        "/images/disaster.jpg"
                )

                .goalAmount(
                        new BigDecimal("75000")
                )

                .raisedAmount(
                        new BigDecimal("30000")
                )

                .duration(
                        "3 months"
                )

                .beneficiaries(
                        "2000+ families"
                )

                .status(
                        Campaign.CampaignStatus.ACTIVE
                )

                .build();


        campaignRepository.save(disaster);
    }
}