package org.example.repository;

import org.example.entity.SecurityEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SecurityEventRepository extends MongoRepository<SecurityEvent, String> {

    List<SecurityEvent> findTop50ByOrderByCreatedAtDesc();
}
