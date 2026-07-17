package org.example.repository;

import org.example.entity.Campaign;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CampaignRepository extends MongoRepository<Campaign, String> {

    List<Campaign> findByStatus(Campaign.CampaignStatus status);
}
