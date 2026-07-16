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
        upsertUser(
                "Tirumala Yagna Prasanna",
                "user@myfundraiser.com",
                "+91 98765 43210",
                "MyFundraiser#User2026",
                User.Role.USER,
                true
        );

        upsertUser(
                "Admin",
                "admin@myfundraiser.com",
                null,
                "MyFundraiser#Admin2026",
                User.Role.ADMIN,
                false
        );
    }

    private void upsertUser(
            String fullName,
            String email,
            String phone,
            String rawPassword,
            User.Role role,
            boolean withProfile
    ) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            User.UserBuilder builder = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .phone(phone)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .anonymousDonation(withProfile)
                    .receiveUpdates(true)
                    .memberSince(withProfile ? LocalDate.of(2026, 5, 1) : LocalDate.now());

            if (withProfile) {
                builder
                        .address("Hyderabad, Telangana, India")
                        .jobRole("Software Developer")
                        .company("MyFundraiser")
                        .experience("3+ Years")
                        .location("Hyderabad, India")
                        .bankName("HDFC Bank")
                        .accountNumber("123456781234")
                        .ifscCode("HDFC0001234")
                        .accountType("Savings Account")
                        .favoriteCause("Education")
                        .preferredMonthlyBudget("Rs 10,000 - Rs 20,000")
                        .profileImageUrl("https://randomuser.me/api/portraits/men/32.jpg");
            }

            userRepository.save(builder.build());
            return;
        }

        // Keep demo credentials in sync with the React login page
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setFullName(fullName);
        if (phone != null) {
            user.setPhone(phone);
        }
        userRepository.save(user);
    }

    private void seedCampaigns() {
        if (campaignRepository.count() > 0) {
            return;
        }

        Campaign education = Campaign.builder()
                .title("Help Children for Education")
                .cause("Education")
                .shortDescription("Support school fees, books, meals, and uniforms for children.")
                .description("Provide quality education to underprivileged children by covering tuition fees, school supplies, uniforms, and nutritious meals. Our program reaches 500+ students across 15 schools in rural areas.")
                .imageUrl("https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80")
                .goalAmount(new BigDecimal("50000"))
                .raisedAmount(new BigDecimal("23000"))
                .duration("12 months")
                .beneficiaries("500+ students")
                .status(Campaign.CampaignStatus.ACTIVE)
                .build();

        Recipient aanya = Recipient.builder()
                .name("Aanya Sharma")
                .supportFor("Class 8 school fees and textbooks")
                .location("Jaipur, Rajasthan")
                .targetAmount(new BigDecimal("12000"))
                .campaign(education)
                .build();

        Recipient rohan = Recipient.builder()
                .name("Rohan Kumar")
                .supportFor("Uniform, transport, and exam fees")
                .location("Patna, Bihar")
                .targetAmount(new BigDecimal("9500"))
                .campaign(education)
                .build();

        Recipient meena = Recipient.builder()
                .name("Meena Devi")
                .supportFor("STEM learning kit and tuition support")
                .location("Dharwad, Karnataka")
                .targetAmount(new BigDecimal("15000"))
                .campaign(education)
                .build();

        education.setRecipients(List.of(aanya, rohan, meena));
        campaignRepository.save(education);

        campaignRepository.save(Campaign.builder()
                .title("Emergency Medical Support")
                .cause("Medical")
                .shortDescription("Help patients needing urgent treatment and medicines.")
                .description("Emergency medical support for patients who need urgent care.")
                .imageUrl("https://images.unsplash.com/photo-1599700403969-f77b3aa74837?auto=format&fit=crop&w=1200&q=80")
                .goalAmount(new BigDecimal("100000"))
                .raisedAmount(new BigDecimal("65000"))
                .duration("6 months")
                .beneficiaries("1000+ patients")
                .status(Campaign.CampaignStatus.ACTIVE)
                .build());

        campaignRepository.save(Campaign.builder()
                .title("Disaster Relief Support")
                .cause("Emergency")
                .shortDescription("Provide food, shelter, and emergency kits to affected families.")
                .description("Immediate disaster relief support for affected communities.")
                .imageUrl("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80")
                .goalAmount(new BigDecimal("75000"))
                .raisedAmount(new BigDecimal("30000"))
                .duration("3 months")
                .beneficiaries("2000+ families")
                .status(Campaign.CampaignStatus.ACTIVE)
                .build());
    }
}
