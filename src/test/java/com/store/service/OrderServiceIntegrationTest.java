package com.store.service;

import com.store.dto.OrderItemRequestDTO;
import com.store.dto.OrderRequestDTO;
import com.store.entity.Category;
import com.store.entity.OrderStatus;
import com.store.entity.Product;
import com.store.entity.Role;
import com.store.entity.User;
import com.store.repository.CategoryRepository;
import com.store.repository.OrderRepository;
import com.store.repository.ProductRepository;
import com.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderServiceIntegrationTest {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;
    @MockBean private EmailService emailService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString();
        user = userRepository.save(User.builder()
                .name("Order Tester")
                .email("order-" + suffix + "@example.com")
                .password("encoded")
                .role(Role.CUSTOMER)
                .build());
        Category category = categoryRepository.save(new Category("Orders-" + suffix));
        product = productRepository.save(new Product(
                null, "Test Product " + suffix, "Test", new BigDecimal("12.50"),
                2, null, null, category));
    }

    @Test
    void createsInquiryWithoutDecrementingStock() {
        setAuthentication();

        OrderRequestDTO request = requestFor(1);
        var response = orderService.createOrder(request);

        assertEquals(new BigDecimal("12.50"), response.getTotalAmount());
        assertEquals(OrderStatus.INQUIRY, response.getStatus());
        assertEquals(2, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
    }

    @Test
    void guestCanCreateOrderWithoutUserAccount() {
        SecurityContextHolder.clearContext();

        OrderRequestDTO request = requestFor(1);
        var response = orderService.createOrder(request);

        assertEquals(new BigDecimal("12.50"), response.getTotalAmount());
        assertEquals(2, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
        assertNull(orderRepository.findById(response.getId()).orElseThrow().getUser());
    }

    @Test
    void staleAuthenticatedUserCanStillPlaceGuestOrder() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("missing@example.com", null, List.of()));

        var response = orderService.createOrder(requestFor(1));

        assertNull(orderRepository.findById(response.getId()).orElseThrow().getUser());
    }

    @Test
    void inquiryAllowsRequestedQuantityAboveCurrentStock() {
        setAuthentication();

        var response = orderService.createOrder(requestFor(3));
        assertEquals(OrderStatus.INQUIRY, response.getStatus());
        assertEquals(2, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
    }

    @Test
    void inquirySendsNotifications() {
        setAuthentication();

        var response = orderService.createOrder(requestFor(2));

        assertEquals(OrderStatus.INQUIRY, response.getStatus());
        assertEquals(2, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
        verify(emailService).sendInquiryNotification(any());
        verify(emailService).sendInquiryConfirmation(any());
    }

    @Test
    void inquiryCanTransitionToPaidOrCancelled() {
        setAuthentication();
        var response = orderService.createOrder(requestFor(1));

        assertEquals(OrderStatus.PAID, orderService.updateStatus(response.getId(), OrderStatus.PAID).getStatus());

        var secondResponse = orderService.createOrder(requestFor(1));
        assertEquals(OrderStatus.CANCELLED,
                orderService.updateStatus(secondResponse.getId(), OrderStatus.CANCELLED).getStatus());
    }

    @Test
    void userCanListOnlyTheirOwnOrders() {
        setAuthentication();
        var ownOrder = orderService.createOrder(requestFor(1));

        PageRequest pageRequest = PageRequest.of(0, 20);
        var orders = orderService.getMyOrders(user.getEmail(), pageRequest);

        assertEquals(1, orders.getTotalElements());
        assertEquals(ownOrder.getId(), orders.getContent().get(0).getId());
    }

    @Test
    void userCannotFetchAnotherUsersOrder() {
        setAuthentication();
        var ownOrder = orderService.createOrder(requestFor(1));

        User otherUser = userRepository.save(User.builder()
                .name("Other User")
                .email("other-" + UUID.randomUUID() + "@example.com")
                .password("encoded")
                .role(Role.CUSTOMER)
                .build());

        assertThrows(org.springframework.security.access.AccessDeniedException.class,
                () -> orderService.getOrderById(ownOrder.getId(), otherUser.getEmail(), false));
    }

    @Test
    void adminCanListAllOrders() {
        setAuthentication();
        orderService.createOrder(requestFor(1));

        var orders = orderService.getAllOrders(null, PageRequest.of(0, 20));

        assertTrue(orders.getTotalElements() >= 1);
    }

    @Test
    void invalidStatusTransitionIsRejected() {
        setAuthentication();
        var order = orderService.createOrder(requestFor(1));

        assertThrows(IllegalArgumentException.class,
                () -> orderService.updateStatus(order.getId(), OrderStatus.SHIPPED));
    }

    private OrderRequestDTO requestFor(int quantity) {
        return OrderRequestDTO.builder()
                .customerName("Order Tester")
                .customerEmail(user.getEmail())
                .shippingAddress("123 Main Street")
                .city("Zagreb")
                .postalCode("10000")
                .items(List.of(new OrderItemRequestDTO(product.getId(), quantity)))
                .build();
    }

    private void setAuthentication() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of()));
    }
}
