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
import com.store.exception.RateLimitExceededException;
import com.store.security.JwtTokenProvider;
import com.store.service.PasswordResetService;
import com.store.service.RefreshTokenService;
import com.store.service.AuthRateLimiter;
import com.store.service.EmailVerificationService;
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
import jakarta.servlet.http.HttpServletRequest;

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
    private final AuthRateLimiter authRateLimiter;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data or email already in use")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterUserRequest registerRequest,
            UriComponentsBuilder uriComponentsBuilder,
            HttpServletRequest request) {
        enforceRateLimit("register", request, registerRequest.getEmail());

        UserDto createdUser = userService.createUser(registerRequest);
        emailVerificationService.issueVerificationEmail(createdUser.getEmail());
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
                .message("User registered successfully. Check your email to verify your account.")
                .build();

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user and get JWT token")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        // DECISION NEEDED: Unverified users currently may log in; enforce verification
        // here only after the product owner chooses between blocking or reduced access.
        enforceRateLimit("login", request, loginRequest.getEmail());
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
        User authenticatedUser = user.getId() == null
                ? null
                : userService.getUserEntityByEmail(loginRequest.getEmail());
        String tokenEmail = authenticatedUser == null
                ? loginRequest.getEmail().trim().toLowerCase(java.util.Locale.ROOT)
                : authenticatedUser.getEmail();
        String token = role == Role.CUSTOMER
                ? jwtTokenProvider.generateToken(tokenEmail)
                : jwtTokenProvider.generateToken(tokenEmail, role);
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
    public ResponseEntity<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest,
            HttpServletRequest request) {
        enforceRateLimit("forgot-password", request, forgotPasswordRequest.getEmail());
        passwordResetService.requestReset(forgotPasswordRequest.getEmail());
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        emailVerificationService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    private void enforceRateLimit(String endpoint, HttpServletRequest request, String email) {
        if (!authRateLimiter.allow(endpoint, request, email)) {
            throw new RateLimitExceededException(
                    "Too many authentication requests. Please try again later.");
        }
    }
}