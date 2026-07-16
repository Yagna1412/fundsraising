package org.example.service;
import org.example.dto.*;



public interface UserService {

    UserProfileResponse getProfile(
            Long userId
    );

    UserProfileResponse updateProfile(
            Long userId,
            UserProfileUpdateRequest request
    );

}