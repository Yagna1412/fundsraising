package org.example.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateCampaignRequest {

    @NotBlank
    private String title;

    private String cause;

    private String shortDescription;

    private String description;

    private String imageUrl;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal goalAmount;

    private String duration;

    private String beneficiaries;
}
