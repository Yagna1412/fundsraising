package org.example.service;

import org.example.dto.*;

public interface UserService {

    UserProfileResponse getProfile(String userId);

    UserProfileResponse updateProfile(String userId, UserProfileUpdateRequest request);
}
