package com.Claimflow.claim_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.Claimflow.claim_service.model.Claim;
import com.Claimflow.claim_service.service.ClaimService;
import com.Claimflow.claim_service.dto.CreateClaimRequest;
import com.Claimflow.claim_service.dto.UpdateClaimStatusRequest;

import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

import jakarta.validation.Valid;



@RequestMapping("/api/claims")
@RestController 
public class ClaimController {


    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }
    
    

    @PostMapping
    public Claim createClaim(@Valid @RequestBody CreateClaimRequest request) {
        return claimService.createClaim(request);
    }



    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }


    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}/status")
    public Claim updateClaimStatus(
            @PathVariable Long id,
            @RequestBody UpdateClaimStatusRequest request) {

        return claimService.updateClaimStatus(id, request);
    }


}


