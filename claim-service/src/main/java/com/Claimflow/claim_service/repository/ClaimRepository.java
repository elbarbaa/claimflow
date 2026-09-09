package com.Claimflow.claim_service.repository;

import com.Claimflow.claim_service.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

}