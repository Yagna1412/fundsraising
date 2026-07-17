package org.example.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "security_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityEvent {

    @Id
    private String id;

    private String type;

    private String userEmail;

    private String ip;

    private String device;

    private String status;

    private LocalDateTime createdAt;
}
