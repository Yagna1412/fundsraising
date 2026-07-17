package org.example.controller;





import org.example.dto.*;
import org.example.service.DonationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;


    @PostMapping
    public ResponseEntity<DonationResponse> donate(

            @Valid
            @RequestBody
            DonationRequest request

    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        donationService.donate(
                                request
                        )
                );

    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DonationResponse>>
    getUserDonations(

            @PathVariable
            String userId

    ) {

        return ResponseEntity.ok(
                donationService
                        .getUserDonations(userId)
        );

    }

}
