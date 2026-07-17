package org.example.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    private String id;

    private String userId;

    private String userFullName;

    private String campaignId;

    private String campaignTitle;

    private String cause;

    private String recipientId;

    private String recipientName;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private String message;

    private Boolean anonymous;

    private LocalDateTime donatedAt;

    private DonationStatus status;

    public enum PaymentMethod {
        UPI,
        CARD,
        NET_BANKING
    }

    public enum DonationStatus {
        SUCCESS,
        FAILED,
        PENDING
    }
}
