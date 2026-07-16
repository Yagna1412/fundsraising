package org.example.controller;
import org.example.dto.*;


import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final org.example.service.UserService userService;


    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse>
    getProfile(

            @PathVariable
            Long userId

    ) {

        return ResponseEntity.ok(
                userService.getProfile(userId)
        );

    }


    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse>
    updateProfile(

            @PathVariable
            Long userId,

            @RequestBody
            UserProfileUpdateRequest request

    ) {

        return ResponseEntity.ok(
                userService.updateProfile(
                        userId,
                        request
                )
        );

    }

}