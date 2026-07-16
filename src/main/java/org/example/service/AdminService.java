package org.example.service;

import org.example.entity.User;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Map;

public interface AdminService {

    Map<String, Object> health();

    Map<String, Object> reports(String period);

    Map<String, Object> payments();

    Map<String, Object> userProfiles();

    Map<String, Object> securityEvents();

    Map<String, Object> logSecurityEvent(Map<String, Object> body);

    Map<String, Object> simulateDonation(User actor);
}
