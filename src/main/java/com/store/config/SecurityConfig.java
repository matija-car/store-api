package com.store.config;

import com.store.security.JwtAuthenticationFilter;
import com.store.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final Environment environment;
    private final String allowedOrigins;
    private final String datasourceUrl;

    public SecurityConfig(
            JwtTokenProvider jwtTokenProvider,
            Environment environment,
            @Value("${app.cors.allowed-origins:}") String allowedOrigins,
            @Value("${spring.datasource.url}") String datasourceUrl) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.environment = environment;
        this.allowedOrigins = allowedOrigins;
        this.datasourceUrl = datasourceUrl;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                            .requestMatchers(HttpMethod.POST, "/orders/**").authenticated()
                            .requestMatchers(HttpMethod.GET, "/orders").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/orders/me").authenticated()
                            .requestMatchers(HttpMethod.GET, "/orders/*").authenticated()
                            .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
                            .requestMatchers("/auth/**").permitAll();
                    auth.requestMatchers("/h2-console/**").denyAll();
                    if (Arrays.asList(environment.getActiveProfiles()).contains("dev")
                            && isH2Datasource()) {
                        auth.requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll();
                    }
                    auth.anyRequest().authenticated();
                });

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    private boolean isH2Datasource() {
        return datasourceUrl != null
                && datasourceUrl.trim().toLowerCase().startsWith("jdbc:h2:");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}