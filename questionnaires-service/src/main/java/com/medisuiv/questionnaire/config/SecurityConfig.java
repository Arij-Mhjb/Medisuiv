package com.medisuiv.questionnaire.config;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }

    static class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

        private final JwtGrantedAuthoritiesConverter scopesConverter = new JwtGrantedAuthoritiesConverter();

        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            Collection<GrantedAuthority> scopeAuthorities = scopesConverter.convert(jwt);
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            List<String> roles = realmAccess == null ? List.of() : (List<String>) realmAccess.getOrDefault("roles", List.of());
            return Stream.concat(
                            scopeAuthorities.stream(),
                            roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())))
                    .toList();
        }
    }
}
