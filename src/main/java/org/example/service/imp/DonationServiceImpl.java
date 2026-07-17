package org.example.service.imp;

import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.DonationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;

    @Override
    public DonationResponse donate(DonationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Recipient recipient = null;
        if (request.getRecipientId() != null) {
            recipient = (campaign.getRecipients() == null ? List.<Recipient>of() : campaign.getRecipients())
                    .stream()
                    .filter(r -> request.getRecipientId().equals(r.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
        }

        Donation donation = Donation.builder()
                .userId(user.getId())
                .userFullName(user.getFullName())
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .cause(campaign.getCause())
                .recipientId(recipient != null ? recipient.getId() : null)
                .recipientName(recipient != null ? recipient.getName() : null)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .message(request.getMessage())
                .anonymous(Boolean.TRUE.equals(request.getAnonymous()))
                .donatedAt(LocalDateTime.now())
                .status(Donation.DonationStatus.SUCCESS)
                .build();

        donation = donationRepository.save(donation);

        campaign.setRaisedAmount(campaign.getRaisedAmount().add(request.getAmount()));
        campaignRepository.save(campaign);

        return map(donation, "Donation successful");
    }

    @Override
    public List<DonationResponse> getUserDonations(String userId) {
        return donationRepository.findByUserIdOrderByDonatedAtDesc(userId)
                .stream()
                .map(donation -> map(donation, null))
                .toList();
    }

    private DonationResponse map(Donation donation, String message) {
        return DonationResponse.builder()
                .donationId(donation.getId())
                .campaignId(donation.getCampaignId())
                .campaignTitle(donation.getCampaignTitle())
                .cause(donation.getCause())
                .recipientName(donation.getRecipientName())
                .amount(donation.getAmount())
                .donatedAt(donation.getDonatedAt())
                .status(donation.getStatus().name())
                .message(message)
                .build();
    }
}
