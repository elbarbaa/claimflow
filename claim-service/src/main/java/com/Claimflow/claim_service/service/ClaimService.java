package com.Claimflow.claim_service.service;

import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;

import com.Claimflow.claim_service.dto.CreateClaimRequest;
import com.Claimflow.claim_service.model.Claim;
import com.Claimflow.claim_service.repository.ClaimRepository;
import com.Claimflow.claim_service.model.ClaimStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.util.Optional;
import com.Claimflow.claim_service.dto.UpdateClaimStatusRequest;
import com.Claimflow.claim_service.exception.ClaimNotFoundException;


@Service 
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final NotificationClient notificationClient;  //for notification microservice

    //create and sav claim
    public ClaimService(ClaimRepository claimRepository, NotificationClient notificationClient) {
        this.claimRepository = claimRepository;
        this.notificationClient = notificationClient;
    }


    public Claim createClaim(CreateClaimRequest request) {
        
        Claim claim = new Claim();


        //setting the claim fields
        claim.setCustomerName(request.getCustomerName());  
        claim.setDescription(request.getDescription());
        claim.setAmount(request.getAmount());

        //following TDD process Red -> Green, I am adding this check for amount. status should be set as unit tests expect now
        if (claim.getAmount().compareTo(new BigDecimal("5000")) <= 0) {
            claim.setStatus(ClaimStatus.APPROVED);
        } 
        else {
            claim.setStatus(ClaimStatus.UNDER_REVIEW);
        }


        claim.setCreatedAt(LocalDateTime.now());


        Claim savedClaim = claimRepository.save(claim);


        notificationClient.sendNotification(savedClaim.getId(), savedClaim.getStatus().toString());  //sending the notification

        
        return savedClaim;

    }

    //retrieves all claims
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }


    //retrieval with id
    public Claim getClaimById(Long id) {
        Optional<Claim> claim = claimRepository.findById(id);

        return claim.orElseThrow(() -> new ClaimNotFoundException("Claim not found"));
    }



    //updating a claim status
    public Claim updateClaimStatus(Long id, UpdateClaimStatusRequest request) {
        Optional<Claim> claim = claimRepository.findById(id);

        if (claim.isPresent()) {
            Claim existingClaim = claim.get();

            existingClaim.setStatus(request.getStatus());

            Claim savedClaim = claimRepository.save(existingClaim);


            notificationClient.sendNotification(savedClaim.getId(),savedClaim.getStatus().toString());  //notification


            return savedClaim;
        }

        throw new ClaimNotFoundException("Claim not found");
    }


}

