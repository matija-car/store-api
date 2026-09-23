package com.store.service;

import com.store.dto.OrderItemRequestDTO;
import com.store.dto.OrderRequestDTO;
import com.store.entity.Category;
import com.store.entity.OrderStatus;
import com.store.entity.Product;
import com.store.entity.Role;
import com.store.entity.User;
import com.store.exception.InsufficientStockException;
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
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderServiceIntegrationTest {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

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
    void createsOrderAndDecrementsStock() {
        setAuthentication();

        OrderRequestDTO request = requestFor(1);
        var response = orderService.createOrder(request);

        assertEquals(new BigDecimal("12.50"), response.getTotalAmount());
        assertEquals(1, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
    }

    @Test
    void insufficientStockLeavesStockUnchanged() {
        setAuthentication();

        assertThrows(InsufficientStockException.class, () -> orderService.createOrder(requestFor(3)));
        assertEquals(2, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
    }

    @Test
    void concurrentOrdersCannotBothBuyTheLastUnit() throws Exception {
        product.setStockQuantity(1);
        productRepository.saveAndFlush(product);

        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch start = new CountDownLatch(1);
        Callable<Boolean> attempt = () -> {
            start.await();
            setAuthentication();
            try {
                orderService.createOrder(requestFor(1));
                return true;
            } catch (RuntimeException ignored) {
                return false;
            }
        };

        Future<Boolean> first = executor.submit(attempt);
        Future<Boolean> second = executor.submit(attempt);
        start.countDown();

        int successes = (first.get(10, TimeUnit.SECONDS) ? 1 : 0)
                + (second.get(10, TimeUnit.SECONDS) ? 1 : 0);
        executor.shutdownNow();

        assertEquals(1, successes);
        assertEquals(0, productRepository.findById(product.getId()).orElseThrow().getStockQuantity());
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
