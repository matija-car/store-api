package com.store.controller;

import com.store.dto.AuthResponse;
import com.store.dto.LoginRequest;
import com.store.dto.RegisterUserRequest;
import com.store.dto.UserDto;
import com.store.security.JwtTokenProvider;
import com.store.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data or email already in use")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterUserRequest registerRequest,
            UriComponentsBuilder uriComponentsBuilder) {

        UserDto createdUser = userService.createUser(registerRequest);

        var location = uriComponentsBuilder
                .path("users/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();

        AuthResponse response = AuthResponse.builder()
                .id(createdUser.getId())
                .name(createdUser.getName())
                .email(createdUser.getEmail())
                .message("User registered successfully")
                .build();

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user and get JWT token")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        boolean isValid = userService.verifyCredentials(loginRequest.getEmail(), loginRequest.getPassword());

        if (!isValid) {
            log.warn("Login failed - invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .message("Invalid email or password")
                            .build());
        }

        String token = jwtTokenProvider.generateToken(loginRequest.getEmail());
        log.info("User logged in successfully: {}", loginRequest.getEmail());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .email(loginRequest.getEmail())
                .message("Login successful")
                .build();

        return ResponseEntity.ok(response);
    }
}