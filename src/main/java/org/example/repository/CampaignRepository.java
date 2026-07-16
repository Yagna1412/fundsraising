package org.example.repository;



import org.example.entity.Campaign;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository
        extends JpaRepository<Campaign, Long> {

    List<Campaign> findByStatus(
            Campaign.CampaignStatus status
    );

}