package org.example.service.imp;



import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.DonationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl
        implements DonationService {

    private final DonationRepository donationRepository;

    private final UserRepository userRepository;

    private final CampaignRepository campaignRepository;

    private final RecipientRepository recipientRepository;


    @Override
    @Transactional
    public DonationResponse donate(
            DonationRequest request
    ) {

        User user =
                userRepository
                        .findById(
                                request.getUserId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Campaign campaign =
                campaignRepository
                        .findById(
                                request.getCampaignId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Campaign not found"
                                )
                        );


        Recipient recipient = null;


        if (
                request.getRecipientId() != null
        ) {

            recipient =
                    recipientRepository
                            .findById(
                                    request.getRecipientId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Recipient not found"
                                    )
                            );


            if (
                    !recipient
                            .getCampaign()
                            .getId()
                            .equals(
                                    campaign.getId()
                            )
            ) {

                throw new RuntimeException(
                        "Recipient does not belong to selected campaign"
                );

            }

        }


        Donation donation =
                Donation.builder()

                        .user(user)

                        .campaign(campaign)

                        .recipient(recipient)

                        .amount(
                                request.getAmount()
                        )

                        .paymentMethod(
                                request.getPaymentMethod()
                        )

                        .message(
                                request.getMessage()
                        )

                        .anonymous(
                                Boolean.TRUE.equals(
                                        request.getAnonymous()
                                )
                        )

                        .donatedAt(
                                LocalDateTime.now()
                        )

                        .status(
                                Donation
                                        .DonationStatus
                                        .SUCCESS
                        )

                        .build();


        donation =
                donationRepository.save(
                        donation
                );


        campaign.setRaisedAmount(

                campaign.getRaisedAmount()
                        .add(
                                request.getAmount()
                        )

        );


        campaignRepository.save(
                campaign
        );


        return map(
                donation,
                "Donation successful"
        );

    }


    @Override
    public List<DonationResponse>
    getUserDonations(
            Long userId
    ) {

        return donationRepository
                .findByUserIdOrderByDonatedAtDesc(
                        userId
                )

                .stream()

                .map(
                        donation ->
                                map(
                                        donation,
                                        null
                                )
                )

                .toList();

    }


    private DonationResponse map(
            Donation donation,
            String message
    ) {

        return DonationResponse.builder()

                .donationId(
                        donation.getId()
                )

                .campaignId(
                        donation
                                .getCampaign()
                                .getId()
                )

                .campaignTitle(
                        donation
                                .getCampaign()
                                .getTitle()
                )

                .cause(
                        donation
                                .getCampaign()
                                .getCause()
                )

                .recipientName(

                        donation.getRecipient() == null

                                ? null

                                : donation
                                .getRecipient()
                                .getName()

                )

                .amount(
                        donation.getAmount()
                )

                .donatedAt(
                        donation.getDonatedAt()
                )

                .status(
                        donation
                                .getStatus()
                                .name()
                )

                .message(message)

                .build();

    }

}
