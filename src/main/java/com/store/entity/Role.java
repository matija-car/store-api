package com.store.entity;

/**
 * ADMIN can manage the product catalog and view all orders/users.
 * CUSTOMER can browse and buy. New registrations always start as CUSTOMER —
 * promote an account to ADMIN directly in the database (or via a future
 * admin-only endpoint). Never let this come from user-supplied input.
 */
public enum Role {
    ADMIN,
    CUSTOMER
}