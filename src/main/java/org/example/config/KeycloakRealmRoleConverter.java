package org.example.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Maps Keycloak realm roles (and client roles) to Spring Security authorities.
 */
public class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    @SuppressWarnings("unchecked")
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.get("roles") instanceof Collection<?> realmRoles) {
            realmRoles.forEach(role -> roles.add(String.valueOf(role)));
        }

        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess != null) {
            Object client = resourceAccess.get("myfundraiser-frontend");
            if (client instanceof Map<?, ?> clientAccess
                    && clientAccess.get("roles") instanceof Collection<?> clientRoles) {
                clientRoles.forEach(role -> roles.add(String.valueOf(role)));
            }
        }

        // Also accept a custom claim used by some setups
        Object directRoles = jwt.getClaim("roles");
        if (directRoles instanceof Collection<?> claimed) {
            claimed.forEach(role -> roles.add(String.valueOf(role)));
        }

        return roles.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
