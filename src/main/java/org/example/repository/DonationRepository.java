package org.example.repository;

import org.example.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByUserIdOrderByDonatedAtDesc(Long userId);

    List<Donation> findAllByOrderByDonatedAtDesc();

    List<Donation> findByDonatedAtAfterOrderByDonatedAtAsc(LocalDateTime after);

    @Query("""
        SELECT COALESCE(SUM(d.amount), 0)
        FROM Donation d
        WHERE d.user.id = :userId
        AND d.status = org.example.entity.Donation.DonationStatus.SUCCESS
    """)
    BigDecimal totalSuccessfulDonations(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(DISTINCT d.campaign.id)
        FROM Donation d
        WHERE d.user.id = :userId
        AND d.status = org.example.entity.Donation.DonationStatus.SUCCESS
    """)
    long countSupportedCampaigns(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(d.amount), 0)
        FROM Donation d
        WHERE d.status = org.example.entity.Donation.DonationStatus.SUCCESS
    """)
    BigDecimal sumAllSuccessful();

    long countByStatus(Donation.DonationStatus status);
}
