package org.example.service;

import org.example.dto.CampaignResponse;
import org.example.dto.CreateCampaignRequest;

import java.util.List;

public interface CampaignService {

    List<CampaignResponse> getActiveCampaigns();

    CampaignResponse getCampaignById(String id);

    CampaignResponse createCampaign(CreateCampaignRequest request);
}
