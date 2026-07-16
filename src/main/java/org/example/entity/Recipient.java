package org.example.entity;



import jakarta.persistence.*;
        import lombok.*;

        import java.math.BigDecimal;

@Entity
@Table(name = "recipients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipient {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String name;

    private String supportFor;

    private String location;

    @Column(
            precision = 15,
            scale = 2
    )
    private BigDecimal targetAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "campaign_id",
            nullable = false
    )
    private Campaign campaign;

}