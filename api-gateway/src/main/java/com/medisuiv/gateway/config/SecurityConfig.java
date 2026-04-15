package com.medisuiv.gateway.config;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(
                                "/actuator/**",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/questionnaires/v3/api-docs/**",
                                "/dashboards/v3/api-docs/**",
                                "/notifications/v3/api-docs/**"
                        ).permitAll()
                        .pathMatchers("/questionnaires/api/questionnaires/**").hasAnyRole("ADMIN", "DOCTOR")
                        .pathMatchers("/dashboards/**").hasAnyRole("ADMIN", "ANALYST", "DOCTOR")
                        .pathMatchers("/notifications/**").hasAnyRole("ADMIN", "DOCTOR")
                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor())))
                .build();
    }

    @Bean
    Converter<Jwt, ? extends Mono<? extends AbstractAuthenticationToken>> grantedAuthoritiesExtractor() {
        JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
        delegate.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return new ReactiveJwtAuthenticationConverterAdapter(delegate);
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

    static class ReactiveJwtAuthenticationConverterAdapter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {

        private final JwtAuthenticationConverter delegate;

        ReactiveJwtAuthenticationConverterAdapter(JwtAuthenticationConverter delegate) {
            this.delegate = delegate;
        }

        @Override
        public Mono<AbstractAuthenticationToken> convert(Jwt source) {
            return Mono.just(delegate.convert(source));
        }
    }
}
