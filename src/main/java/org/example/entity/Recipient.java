package org.example.entity;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipient {

    @Id
    private String id;

    private String name;

    private String supportFor;

    private String location;

    private BigDecimal targetAmount;
}
