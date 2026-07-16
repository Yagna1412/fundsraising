package org.example.dto;



import lombok.*;

        import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationResponse {

    private Long donationId;

    private Long campaignId;

    private String campaignTitle;

    private String cause;

    private String recipientName;

    private BigDecimal amount;

    private LocalDateTime donatedAt;

    private String status;

    private String message;

}