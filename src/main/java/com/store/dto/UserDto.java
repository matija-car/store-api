package com.store.dto;

import com.store.entity.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "User DTO")
public class UserDto {

    @Schema(description = "User ID", example = "1")
    private Long id;

    @Schema(description = "User full name", example = "John Doe")
    private String name;

    @Schema(description = "User email address", example = "john@example.com")
    private String email;

    private Role role;

    public UserDto(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}