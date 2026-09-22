package com.store.controller;

import com.store.dto.AuthResponse;
import com.store.dto.ForgotPasswordRequest;
import com.store.dto.LoginRequest;
import com.store.dto.RegisterUserRequest;
import com.store.dto.RefreshTokenRequest;
import com.store.dto.ResetPasswordRequest;
import com.store.dto.UserDto;
import com.store.entity.Role;
import com.store.entity.User;
import com.store.security.JwtTokenProvider;
import com.store.service.PasswordResetService;
import com.store.service.RefreshTokenService;
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
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data or email already in use")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterUserRequest registerRequest,
            UriComponentsBuilder uriComponentsBuilder) {

        UserDto createdUser = userService.createUser(registerRequest);
        Role role = createdUser.getRole() == null ? Role.CUSTOMER : createdUser.getRole();

        var location = uriComponentsBuilder
                .path("users/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();

        AuthResponse response = AuthResponse.builder()
                .id(createdUser.getId())
                .name(createdUser.getName())
                .email(createdUser.getEmail())
                .role(role)
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

        UserDto user = userService.getUserByEmail(loginRequest.getEmail());
        if (user == null) {
            user = new UserDto(null, null, loginRequest.getEmail());
        }
        Role role = user.getRole() == null ? Role.CUSTOMER : user.getRole();
        String token = role == Role.CUSTOMER
                ? jwtTokenProvider.generateToken(loginRequest.getEmail())
                : jwtTokenProvider.generateToken(loginRequest.getEmail(), role);
        User authenticatedUser = userService.getUserEntityByEmail(loginRequest.getEmail());
        String refreshToken = authenticatedUser == null
                ? null
                : refreshTokenService.issueToken(authenticatedUser);
        log.info("User logged in successfully: {}", loginRequest.getEmail());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(loginRequest.getEmail())
                .id(user.getId())
                .name(user.getName())
                .role(role)
                .message("Login successful")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        User user = refreshTokenService.rotateToken(request.getRefreshToken());
        Role role = user.getRole() == null ? Role.CUSTOMER : user.getRole();
        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), role);
        String replacementRefreshToken = refreshTokenService.issueToken(user);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(accessToken)
                .refreshToken(replacementRefreshToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(role)
                .message("Token refreshed")
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revokeToken(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.getEmail());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}