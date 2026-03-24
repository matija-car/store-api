package com.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Authentication response")
public class AuthResponse {

    @Schema(description = "JWT token", example = "eyJhbGciOiJIUzUxMiJ9...")
    private String token;

    @Schema(description = "User email", example = "john@example.com")
    private String email;

    @Schema(description = "User ID", example = "1")
    private Long id;

    @Schema(description = "User full name", example = "John Doe")
    private String name;

    @Schema(description = "Response message", example = "Login successful")
    private String message;
}