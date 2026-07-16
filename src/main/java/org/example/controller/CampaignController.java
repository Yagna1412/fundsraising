package org.example.controller;





import org.example.dto.CampaignResponse;
import org.example.service.CampaignService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;


    @GetMapping
    public ResponseEntity<List<CampaignResponse>>
    getActiveCampaigns() {

        return ResponseEntity.ok(
                campaignService
                        .getActiveCampaigns()
        );

    }


    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse>
    getCampaign(

            @PathVariable
            Long id

    ) {

        return ResponseEntity.ok(
                campaignService
                        .getCampaignById(id)
        );

    }

}
