package org.example.repository;



import org.example.entity.Recipient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipientRepository
        extends JpaRepository<Recipient, Long> {

    List<Recipient> findByCampaignId(
            Long campaignId
    );

}