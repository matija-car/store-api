package com.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {

    @NotBlank(message = "Ime i prezime su obvezni")
    private String customerName;

    @NotBlank(message = "Email je obvezan")
    @Email(message = "Email mora biti valjan")
    private String customerEmail;

    @NotBlank(message = "Adresa dostave je obvezna")
    private String shippingAddress;

    @NotBlank(message = "Grad je obvezan")
    private String city;

    @NotBlank(message = "Poštanski broj je obvezan")
    private String postalCode;

    @NotEmpty(message = "Narudžba mora sadržavati barem jednu stavku")
    private List<OrderItemRequestDTO> items;
}