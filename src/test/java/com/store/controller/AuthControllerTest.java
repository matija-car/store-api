package com.store.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.dto.LoginRequest;
import com.store.dto.RegisterUserRequest;
import com.store.dto.UserDto;
import com.store.security.JwtTokenProvider;
import com.store.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private RegisterUserRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterUserRequest("John Doe", "john@example.com", "password123");
        loginRequest = new LoginRequest("john@example.com", "password123");
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegisterSuccess() throws Exception {
        // Arrange
        UserDto userDto = new UserDto(1L, "John Doe", "john@example.com");
        when(userService.createUser(any(RegisterUserRequest.class))).thenReturn(userDto);

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).createUser(any(RegisterUserRequest.class));
    }

    @Test
    @DisplayName("Should login successfully and return token")
    void testLoginSuccess() throws Exception {
        // Arrange
        when(userService.verifyCredentials("john@example.com", "password123")).thenReturn(true);
        when(jwtTokenProvider.generateToken("john@example.com")).thenReturn("test-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).verifyCredentials("john@example.com", "password123");
        verify(jwtTokenProvider, times(1)).generateToken("john@example.com");
    }

    @Test
    @DisplayName("Should fail login with invalid password")
    void testLoginInvalidPassword() throws Exception {
        // Arrange
        when(userService.verifyCredentials("john@example.com", "wrongpassword")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("john@example.com", "wrongpassword"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));

        verify(userService, times(1)).verifyCredentials("john@example.com", "wrongpassword");
    }

    @Test
    @DisplayName("Should fail login with non-existent user")
    void testLoginUserNotFound() throws Exception {
        // Arrange
        when(userService.verifyCredentials("nonexistent@example.com", "password123")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("nonexistent@example.com", "password123"))))
                .andExpect(status().isUnauthorized());

        verify(userService, times(1)).verifyCredentials("nonexistent@example.com", "password123");
    }
}