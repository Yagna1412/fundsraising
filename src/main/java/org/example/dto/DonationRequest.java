package org.example.dto;


import jakarta.validation.constraints.*;

        import lombok.Data;
import org.example.entity.Donation;

import java.math.BigDecimal;

@Data
public class DonationRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long campaignId;

    private Long recipientId;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal amount;

    @NotNull
    private Donation.PaymentMethod paymentMethod;

    private String message;

    private Boolean anonymous;

}