package org.example.service.imp;



import org.example.dto.*;
import org.example.entity.Campaign;
import org.example.repository.CampaignRepository;
import org.example.service.CampaignService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl
        implements CampaignService {

    private final CampaignRepository campaignRepository;


    @Override
    public List<CampaignResponse>
    getActiveCampaigns() {

        return campaignRepository
                .findByStatus(
                        Campaign.CampaignStatus.ACTIVE
                )
                .stream()
                .map(this::map)
                .toList();

    }


    @Override
    public CampaignResponse getCampaignById(
            Long id
    ) {

        Campaign campaign =
                campaignRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Campaign not found"
                                )
                        );

        return map(campaign);

    }


    private CampaignResponse map(
            Campaign campaign
    ) {

        int percentage = 0;


        if (
                campaign.getGoalAmount() != null
                        &&
                        campaign.getGoalAmount()
                                .compareTo(BigDecimal.ZERO) > 0
        ) {

            percentage =
                    campaign.getRaisedAmount()

                            .multiply(
                                    BigDecimal.valueOf(100)
                            )

                            .divide(
                                    campaign.getGoalAmount(),
                                    0,
                                    RoundingMode.HALF_UP
                            )

                            .intValue();

        }


        List<RecipientResponse> recipients =
                campaign.getRecipients()
                        .stream()
                        .map(
                                recipient ->
                                        RecipientResponse
                                                .builder()

                                                .id(
                                                        recipient.getId()
                                                )

                                                .name(
                                                        recipient.getName()
                                                )

                                                .supportFor(
                                                        recipient.getSupportFor()
                                                )

                                                .location(
                                                        recipient.getLocation()
                                                )

                                                .targetAmount(
                                                        recipient.getTargetAmount()
                                                )

                                                .build()
                        )
                        .toList();


        return CampaignResponse.builder()

                .id(campaign.getId())

                .title(campaign.getTitle())

                .cause(campaign.getCause())

                .shortDescription(
                        campaign.getShortDescription()
                )

                .description(
                        campaign.getDescription()
                )

                .imageUrl(
                        campaign.getImageUrl()
                )

                .goalAmount(
                        campaign.getGoalAmount()
                )

                .raisedAmount(
                        campaign.getRaisedAmount()
                )

                .fundedPercentage(percentage)

                .duration(
                        campaign.getDuration()
                )

                .beneficiaries(
                        campaign.getBeneficiaries()
                )

                .status(
                        campaign.getStatus().name()
                )

                .recipients(recipients)

                .build();

    }

}
