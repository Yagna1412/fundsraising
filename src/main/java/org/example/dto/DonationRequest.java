package org.example.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.example.entity.Donation;

import java.math.BigDecimal;

@Data
public class DonationRequest {

    @NotNull
    private String userId;

    @NotNull
    private String campaignId;

    private String recipientId;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal amount;

    @NotNull
    private Donation.PaymentMethod paymentMethod;

    private String message;

    private Boolean anonymous;
}
