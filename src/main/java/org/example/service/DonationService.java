package org.example.service;


import org.example.dto.*;



import java.util.List;

public interface DonationService {

    DonationResponse donate(
            DonationRequest request
    );

    List<DonationResponse>
    getUserDonations(
            Long userId
    );

}