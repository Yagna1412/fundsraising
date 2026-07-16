package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return adminService.health();
    }

    @GetMapping("/reports/{period}")
    public Map<String, Object> reports(@PathVariable String period) {
        return adminService.reports(period);
    }

    @GetMapping("/payments")
    public Map<String, Object> payments() {
        return adminService.payments();
    }

    @GetMapping("/users/profiles")
    public Map<String, Object> profiles() {
        return adminService.userProfiles();
    }

    @GetMapping("/security/events")
    public Map<String, Object> securityEvents() {
        return adminService.securityEvents();
    }

    @PostMapping("/security/events")
    public ResponseEntity<Map<String, Object>> logSecurityEvent(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.logSecurityEvent(body));
    }

    @PostMapping("/donations/simulate")
    public Map<String, Object> simulate(@AuthenticationPrincipal Jwt jwt) {
        User actor = null;
        if (jwt != null && jwt.getClaimAsString("email") != null) {
            actor = userRepository.findByEmail(jwt.getClaimAsString("email")).orElse(null);
        }
        return adminService.simulateDonation(actor);
    }
}
