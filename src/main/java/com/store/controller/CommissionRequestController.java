package com.store.controller;

import com.store.dto.CommissionRequestStatusUpdateRequest;
import com.store.entity.CommissionRequest;
import com.store.service.CommissionRequestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commission-requests")
@RequiredArgsConstructor
public class CommissionRequestController {

    private final CommissionRequestService commissionRequestService;

    @PostMapping
    public ResponseEntity<CommissionRequest> createCommissionRequest(
            @Valid @RequestBody CommissionRequest request,
            HttpServletRequest httpRequest) {
        CommissionRequest created = commissionRequestService.createCommissionRequest(request, httpRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CommissionRequest>> getAllCommissionRequests(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(commissionRequestService.getAllCommissionRequests(pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommissionRequest> updateCommissionRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody CommissionRequestStatusUpdateRequest request) {
        return ResponseEntity.ok(commissionRequestService.updateStatus(id, request.getStatus()));
    }
}
