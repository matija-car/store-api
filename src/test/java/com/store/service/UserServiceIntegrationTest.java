package com.store.service;

import com.store.dto.ChangePasswordRequest;
import com.store.dto.RegisterUserRequest;
import com.store.dto.UpdateUserRequest;
import com.store.dto.UserDto;
import com.store.entity.User;
import com.store.exception.ResourceNotFoundException;
import com.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@DisplayName("UserService Integration Tests")
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterUserRequest registerRequest;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        registerRequest = new RegisterUserRequest("John Doe", "john@example.com", "password123");
    }

    @Test
    @DisplayName("Should create user successfully")
    void testCreateUser() {
        UserDto createdUser = userService.createUser(registerRequest);

        assertNotNull(createdUser.getId());
        assertEquals("John Doe", createdUser.getName());
        assertEquals("john@example.com", createdUser.getEmail());

        User savedUser = userRepository.findById(createdUser.getId()).orElse(null);
        assertNotNull(savedUser);
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
    }

    @Test
    @DisplayName("Should throw exception when email is already in use")
    void testCreateUserDuplicateEmail() {
        userService.createUser(registerRequest);
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(registerRequest));
    }

    @Test
    @DisplayName("Should get all users with pagination")
    void testGetAllUsers() {
        userService.createUser(registerRequest);
        userService.createUser(new RegisterUserRequest("Jane Doe", "jane@example.com", "password456"));

        Pageable pageable = PageRequest.of(0, 20);
        Page<UserDto> usersPage = userService.getAllUsers(pageable);

        assertEquals(2, usersPage.getTotalElements());
        assertEquals(1, usersPage.getTotalPages());
    }

    @Test
    @DisplayName("Should get user by id")
    void testGetUserById() {
        UserDto createdUser = userService.createUser(registerRequest);
        UserDto foundUser = userService.getUserById(createdUser.getId());

        assertEquals(createdUser.getId(), foundUser.getId());
        assertEquals("John Doe", foundUser.getName());
        assertEquals("john@example.com", foundUser.getEmail());
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testGetUserByIdNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999L));
    }

    @Test
    @DisplayName("Should update user name and email without changing password")
    void testUpdateUser() {
        UserDto createdUser = userService.createUser(registerRequest);
        UpdateUserRequest updateRequest = new UpdateUserRequest("Jane Doe", "jane@example.com");

        UserDto updatedUser = userService.updateUser(createdUser.getId(), updateRequest);

        assertEquals("Jane Doe", updatedUser.getName());
        assertEquals("jane@example.com", updatedUser.getEmail());

        User savedUser = userRepository.findById(createdUser.getId()).orElse(null);
        assertNotNull(savedUser);
        // Password must remain the original one — update does not touch it
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
    }

    @Test
    @DisplayName("Should throw exception when updating with an email already in use")
    void testUpdateUserDuplicateEmail() {
        userService.createUser(registerRequest);
        UserDto secondUser = userService.createUser(
                new RegisterUserRequest("Jane Doe", "jane@example.com", "password456"));

        UpdateUserRequest updateRequest = new UpdateUserRequest("Jane Doe", "john@example.com");

        assertThrows(IllegalArgumentException.class, () ->
                userService.updateUser(secondUser.getId(), updateRequest));
    }

    @Test
    @DisplayName("Should delete user successfully")
    void testDeleteUser() {
        UserDto createdUser = userService.createUser(registerRequest);
        userService.deleteUser(createdUser.getId());
        assertFalse(userRepository.existsById(createdUser.getId()));
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent user")
    void testDeleteUserNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(999L));
    }

    @Test
    @DisplayName("Should change password successfully")
    void testChangePassword() {
        UserDto createdUser = userService.createUser(registerRequest);
        userService.changePassword(createdUser.getId(), new ChangePasswordRequest("password123", "newPassword456"));

        User savedUser = userRepository.findById(createdUser.getId()).orElse(null);
        assertNotNull(savedUser);
        assertTrue(passwordEncoder.matches("newPassword456", savedUser.getPassword()));
    }

    @Test
    @DisplayName("Should throw exception when old password is incorrect")
    void testChangePasswordWrongOldPassword() {
        UserDto createdUser = userService.createUser(registerRequest);
        assertThrows(IllegalArgumentException.class, () ->
                userService.changePassword(createdUser.getId(),
                        new ChangePasswordRequest("wrongPassword", "newPassword456"))
        );
    }

    @Test
    @DisplayName("Should verify credentials successfully")
    void testVerifyCredentials() {
        userService.createUser(registerRequest);
        assertTrue(userService.verifyCredentials("john@example.com", "password123"));
    }

    @Test
    @DisplayName("Should return false for invalid password")
    void testVerifyCredentialsInvalidPassword() {
        userService.createUser(registerRequest);
        assertFalse(userService.verifyCredentials("john@example.com", "wrongpassword"));
    }

    @Test
    @DisplayName("Should return false for non-existent user")
    void testVerifyCredentialsUserNotFound() {
        assertFalse(userService.verifyCredentials("nonexistent@example.com", "password123"));
    }
}