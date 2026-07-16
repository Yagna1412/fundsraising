package org.example.entity;



import jakarta.persistence.*;
        import lombok.*;

        import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "campaign_id",
            nullable = false
    )
    private Campaign campaign;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;


    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal amount;


    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;


    @Column(length = 1000)
    private String message;


    private Boolean anonymous;


    private LocalDateTime donatedAt;


    @Enumerated(EnumType.STRING)
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