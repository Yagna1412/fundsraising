package org.example.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    private String id;

    private String title;

    private String cause;

    private String shortDescription;

    private String description;

    private String imageUrl;

    private BigDecimal goalAmount;

    private BigDecimal raisedAmount;

    private String duration;

    private String beneficiaries;

    private CampaignStatus status;

    @Builder.Default
    private List<Recipient> recipients = new ArrayList<>();

    public enum CampaignStatus {
        ACTIVE,
        COMPLETED,
        INACTIVE
    }
}
