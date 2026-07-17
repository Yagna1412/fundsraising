package org.example.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipientResponse {

    private String id;

    private String name;

    private String supportFor;

    private String location;

    private BigDecimal targetAmount;
}
