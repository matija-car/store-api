package com.store.service;

import com.store.dto.OrderRequestDTO;
import com.store.dto.OrderResponseDTO;
import com.store.entity.Order;
import com.store.entity.OrderItem;
import com.store.entity.OrderStatus;
import com.store.entity.Product;
import com.store.entity.User;
import com.store.entity.StoreMode;
import com.store.exception.ResourceNotFoundException;
import com.store.exception.InsufficientStockException;
import com.store.repository.OrderRepository;
import com.store.repository.ProductRepository;
import com.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.mail.MailException;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final StoreSettingsService storeSettingsService;
    private final EmailService emailService;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User currentUser = findAuthenticatedUser();
        boolean catalogMode = storeSettingsService.getMode() == StoreMode.CATALOG;

        Order order = Order.builder()
                .user(currentUser)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .shippingAddress(request.getShippingAddress())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .prayerRequest(request.getPrayerRequest())
                .status(catalogMode ? OrderStatus.INQUIRY : OrderStatus.PENDING)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            Product product = (catalogMode
                    ? productRepository.findById(itemReq.getProductId())
                    : productRepository.findByIdForUpdate(itemReq.getProductId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Proizvod s ID-em " + itemReq.getProductId() + " nije pronađen"));
            int availableStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            if (catalogMode && availableStock <= 0) {
                throw new InsufficientStockException("Proizvod s ID-em " + itemReq.getProductId() + " trenutno nije dostupan");
            }
            if (!catalogMode && itemReq.getQuantity() > availableStock) {
                throw new InsufficientStockException("Nema dovoljno zalihe za proizvod s ID-em "
                        + itemReq.getProductId() + ". Dostupno: " + availableStock);
            }
            if (!catalogMode) {
                product.setStockQuantity(availableStock - itemReq.getQuantity());
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        if (catalogMode) {
            sendInquiryEmails(savedOrder);
        }
        return toResponseDTO(savedOrder);
    }

    private void sendInquiryEmails(Order order) {
        try {
            emailService.sendInquiryNotification(order);
        } catch (MailException ex) {
            log.warn("Inquiry notification could not be sent for order {}", order.getId());
        }
        try {
            emailService.sendInquiryConfirmation(order);
        } catch (MailException ex) {
            log.warn("Inquiry confirmation could not be sent for order {}", order.getId());
        }
    }

    private User findAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof String email)
                || "anonymousUser".equals(email)) {
            return null;
        }

        return userRepository.findByEmailIgnoreCase(email.trim()).orElse(null);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getMyOrders(String email, Pageable pageable) {
        User user = findUserByEmail(email);
        return orderRepository.findByUserId(user.getId(), pageable).map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders = status == null
                ? orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                : orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return orders.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long id, String email, boolean admin) {
        Order order = findOrderById(id);
        assertCanAccess(order, email, admin);
        return toResponseDTO(order);
    }

    @Transactional
    public OrderResponseDTO updateStatus(Long id, OrderStatus newStatus) {
        Order order = findOrderById(id);
        OrderStatus currentStatus = order.getStatus();
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new IllegalArgumentException("Invalid order status transition from "
                    + currentStatus + " to " + newStatus);
        }
        order.setStatus(newStatus);
        return toResponseDTO(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = findOrderById(id);
        orderRepository.delete(order);
    }

    public Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Narudžba nije pronađena"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private void assertCanAccess(Order order, String email, boolean admin) {
        if (!admin && (order.getUser() == null || !email.equals(order.getUser().getEmail()))) {
            throw new AccessDeniedException("You are not authorized to view this order");
        }
    }

    private boolean isValidTransition(OrderStatus current, OrderStatus next) {
        if (current == next) {
            return true;
        }
        return switch (current) {
            case INQUIRY -> next == OrderStatus.PAID || next == OrderStatus.CANCELLED;
            case PENDING -> next == OrderStatus.PAID || next == OrderStatus.CANCELLED;
            case PAID -> next == OrderStatus.SHIPPED || next == OrderStatus.CANCELLED;
            case SHIPPED -> next == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
    }

    public OrderResponseDTO toResponseDTO(Order order) {
        List<OrderResponseDTO.OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderResponseDTO.OrderItemResponseDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .shippingAddress(order.getShippingAddress())
                .city(order.getCity())
                .postalCode(order.getPostalCode())
                .prayerRequest(order.getPrayerRequest())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }
}