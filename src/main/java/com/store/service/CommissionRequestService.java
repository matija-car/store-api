package com.store.service;

import com.store.entity.CommissionRequest;
import com.store.entity.CommissionStatus;
import com.store.entity.User;
import com.store.exception.RateLimitExceededException;
import com.store.exception.ResourceNotFoundException;
import com.store.repository.CommissionRequestRepository;
import com.store.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommissionRequestService {

    private final CommissionRequestRepository commissionRequestRepository;
    private final AuthRateLimiter authRateLimiter;
    private final UserRepository userRepository;

    @Transactional
    public CommissionRequest createCommissionRequest(CommissionRequest request, HttpServletRequest httpRequest) {
        if (!authRateLimiter.allow("commission-request", httpRequest, request.getEmail())) {
            throw new RateLimitExceededException("Too many commission requests. Please wait a minute and try again.");
        }
        request.setStatus(CommissionStatus.NEW);
        attachUserIdIfAuthenticated(request);
        return commissionRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public Page<CommissionRequest> getAllCommissionRequests(Pageable pageable) {
        return commissionRequestRepository.findAll(pageable);
    }

    @Transactional
    public CommissionRequest updateStatus(Long id, CommissionStatus status) {
        CommissionRequest request = commissionRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission request not found with id: " + id));
        request.setStatus(status);
        return commissionRequestRepository.save(request);
    }

    private void attachUserIdIfAuthenticated(CommissionRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            return;
        }
        String email = authentication.getName();
        if ("anonymousUser".equalsIgnoreCase(email)) {
            return;
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            request.setUserId(user.getId());
        }
    }
}
