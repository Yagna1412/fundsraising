package org.example.dto;



import lombok.*;

        import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignResponse {

    private Long id;

    private String title;

    private String cause;

    private String shortDescription;

    private String description;

    private String imageUrl;

    private BigDecimal goalAmount;

    private BigDecimal raisedAmount;

    private int fundedPercentage;

    private String duration;

    private String beneficiaries;

    private String status;

    private List<RecipientResponse> recipients;

}