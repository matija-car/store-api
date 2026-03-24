package com.store.mapper;

import com.store.dto.RegisterUserRequest;
import com.store.dto.UpdateUserRequest;
import com.store.dto.UserDto;
import com.store.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "favoriteProducts", ignore = true)
    User toEntity(RegisterUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "favoriteProducts", ignore = true)
    void update(UpdateUserRequest request, @MappingTarget User user);
}