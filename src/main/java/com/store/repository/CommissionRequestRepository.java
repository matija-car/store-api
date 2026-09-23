package com.store.repository;

import com.store.entity.CommissionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommissionRequestRepository extends JpaRepository<CommissionRequest, Long> {
}
