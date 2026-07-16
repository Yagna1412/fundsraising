package org.example.service;

import org.example.dto.CampaignResponse;



import java.util.List;

public interface CampaignService {

    List<CampaignResponse>
    getActiveCampaigns();

    CampaignResponse getCampaignById(
            Long id
    );

}