package com.store.mapper;

import com.store.dto.RegisterUserRequest;
import com.store.dto.UpdateUserRequest;
import com.store.dto.UserDto;
import com.store.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    UserDto toDto(User user);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    User toEntity(UserDto userDto);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    User toEntity(RegisterUserRequest registerUserRequest);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE,
            nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(UpdateUserRequest dto, @MappingTarget User user);
}