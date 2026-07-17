package org.example.repository;

import org.example.entity.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {

    List<Donation> findByUserIdOrderByDonatedAtDesc(String userId);

    List<Donation> findAllByOrderByDonatedAtDesc();

    List<Donation> findByDonatedAtAfterOrderByDonatedAtAsc(LocalDateTime after);

    List<Donation> findByUserIdAndStatus(String userId, Donation.DonationStatus status);

    List<Donation> findByStatus(Donation.DonationStatus status);

    long countByStatus(Donation.DonationStatus status);
}
