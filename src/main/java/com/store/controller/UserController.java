package com.store.controller;

import com.store.dto.ChangePasswordRequest;
import com.store.dto.RegisterUserRequest;
import com.store.dto.UpdateUserRequest;
import com.store.dto.UserDto;
import com.store.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
@Slf4j
@Tag(name = "Users", description = "User management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users with pagination")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    public ResponseEntity<Page<UserDto>> getAllUsers(@ParameterObject Pageable pageable) {
        Page<UserDto> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data or email already in use")
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody RegisterUserRequest registerRequest,
            UriComponentsBuilder uriComponentsBuilder) {

        UserDto createdUser = userService.createUser(registerRequest);

        var location = uriComponentsBuilder
                .path("users/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user name and email")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or email already in use")
    @ApiResponse(responseCode = "403", description = "Not authorized to modify this user")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest updateRequest) {

        validateOwnership(id);
        UserDto updatedUser = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete user")
    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @ApiResponse(responseCode = "403", description = "Not authorized to delete this user")
    @ApiResponse(responseCode = "404", description = "User not found")
    public void deleteUser(@PathVariable Long id) {
        validateOwnership(id);
        userService.deleteUser(id);
    }

    @PostMapping("/{id}/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Change user password")
    @ApiResponse(responseCode = "204", description = "Password changed successfully")
    @ApiResponse(responseCode = "400", description = "Old password is incorrect")
    @ApiResponse(responseCode = "403", description = "Not authorized to change this user's password")
    @ApiResponse(responseCode = "404", description = "User not found")
    public void changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {

        validateOwnership(id);
        userService.changePassword(id, changePasswordRequest);
    }

    private void validateOwnership(Long userId) {
        String currentEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDto currentUser = userService.getUserByEmail(currentEmail);
        if (!currentUser.getId().equals(userId)) {
            log.warn("User {} attempted to modify resource belonging to user id {}", currentEmail, userId);
            throw new AccessDeniedException("You are not authorized to modify this user");
        }
    }
}