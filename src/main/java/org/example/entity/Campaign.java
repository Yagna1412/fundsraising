package org.example.entity;



import jakarta.persistence.*;
        import lombok.*;

        import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String title;

    private String cause;

    @Column(length = 2000)
    private String shortDescription;

    @Column(length = 5000)
    private String description;

    private String imageUrl;

    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal goalAmount;

    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal raisedAmount;

    private String duration;

    private String beneficiaries;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    @OneToMany(
            mappedBy = "campaign",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Recipient> recipients =
            new ArrayList<>();


    public enum CampaignStatus {

        ACTIVE,
        COMPLETED,
        INACTIVE

    }
}