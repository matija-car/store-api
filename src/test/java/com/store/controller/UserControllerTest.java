package com.store.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.dto.RegisterUserRequest;
import com.store.dto.UpdateUserRequest;
import com.store.dto.UserDto;
import com.store.exception.ResourceNotFoundException;
import com.store.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@DisplayName("UserController Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private RegisterUserRequest registerRequest;
    private UpdateUserRequest updateRequest;
    private UserDto johnDto;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterUserRequest("John Doe", "john@example.com", "password123");
        updateRequest = new UpdateUserRequest("John Doe", "john@example.com");
        johnDto = new UserDto(1L, "John Doe", "john@example.com");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("john@example.com", null, Collections.emptyList())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should create user successfully")
    void testCreateUserSuccess() throws Exception {
        when(userService.createUser(any(RegisterUserRequest.class))).thenReturn(johnDto);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).createUser(any(RegisterUserRequest.class));
    }

    @Test
    @DisplayName("Should get all users")
    void testGetAllUsers() throws Exception {
        Page<UserDto> page = new PageImpl<>(Arrays.asList(johnDto), PageRequest.of(0, 20), 1);
        when(userService.getAllUsers(PageRequest.of(0, 20))).thenReturn(page);

        mockMvc.perform(get("/users")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name").value("John Doe"))
                .andExpect(jsonPath("$.content[0].email").value("john@example.com"));

        verify(userService, times(1)).getAllUsers(PageRequest.of(0, 20));
    }

    @Test
    @DisplayName("Should get user by id")
    void testGetUserById() throws Exception {
        when(userService.getUserById(1L)).thenReturn(johnDto);

        mockMvc.perform(get("/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    @DisplayName("Should update user")
    void testUpdateUser() throws Exception {
        UserDto updatedUser = new UserDto(1L, "Jane Doe", "jane@example.com");
        when(userService.getUserByEmail("john@example.com")).thenReturn(johnDto);
        when(userService.updateUser(eq(1L), any(UpdateUserRequest.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Jane Doe"));

        verify(userService, times(1)).updateUser(eq(1L), any(UpdateUserRequest.class));
    }

    @Test
    @DisplayName("Should return 403 when updating another user")
    void testUpdateUserForbidden() throws Exception {
        UserDto anotherUser = new UserDto(2L, "Other User", "other@example.com");
        when(userService.getUserByEmail("john@example.com")).thenReturn(johnDto);

        mockMvc.perform(put("/users/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should delete user")
    void testDeleteUser() throws Exception {
        when(userService.getUserByEmail("john@example.com")).thenReturn(johnDto);

        mockMvc.perform(delete("/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    @DisplayName("Should return 403 when deleting another user")
    void testDeleteUserForbidden() throws Exception {
        when(userService.getUserByEmail("john@example.com")).thenReturn(johnDto);

        mockMvc.perform(delete("/users/2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should return 404 for non-existent user")
    void testGetUserNotFound() throws Exception {
        when(userService.getUserById(999L))
                .thenThrow(new ResourceNotFoundException("User not found with id: 999"));

        mockMvc.perform(get("/users/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found with id: 999"));
    }
}