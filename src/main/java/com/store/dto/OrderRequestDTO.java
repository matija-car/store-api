package com.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {

    @NotBlank(message = "Ime i prezime su obvezni")
    @Size(min = 2, max = 100, message = "Ime i prezime moraju imati između 2 i 100 znakova")
    @Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Ime i prezime sadrže nedozvoljene znakove")
    private String customerName;

    @NotBlank(message = "Email je obvezan")
    @Email(message = "Email mora biti valjan")
    @Size(max = 254, message = "Email je predugačak")
    private String customerEmail;

    @NotBlank(message = "Adresa dostave je obvezna")
    @Size(min = 3, max = 255, message = "Adresa mora imati između 3 i 255 znakova")
    private String shippingAddress;

    @NotBlank(message = "Grad je obvezan")
    @Size(min = 2, max = 100, message = "Grad mora imati između 2 i 100 znakova")
    @Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Grad sadrži nedozvoljene znakove")
    private String city;

    @NotBlank(message = "Poštanski broj je obvezan")
    @Pattern(regexp = "^[0-9]{4,10}$", message = "Poštanski broj mora sadržavati 4 do 10 znamenki")
    private String postalCode;

    @NotEmpty(message = "Narudžba mora sadržavati barem jednu stavku")
    @Size(max = 50, message = "Narudžba može sadržavati najviše 50 stavki")
    @Valid
    private List<OrderItemRequestDTO> items;

    @Size(max = 1000, message = "Poruka je predugačka")
    private String prayerRequest;
}