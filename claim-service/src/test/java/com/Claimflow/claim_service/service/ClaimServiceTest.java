package com.Claimflow.claim_service.service;

import java.math.BigDecimal;
import com.Claimflow.claim_service.dto.CreateClaimRequest;
import com.Claimflow.claim_service.exception.ClaimNotFoundException;
import com.Claimflow.claim_service.model.Claim;
import com.Claimflow.claim_service.model.ClaimStatus;
import com.Claimflow.claim_service.repository.ClaimRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.mockito.Mock;
//import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;





public class ClaimServiceTest {
    
    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private NotificationClient notificationClient;

    private ClaimService claimService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        claimService = new ClaimService(claimRepository, notificationClient);
    }


    //adding tests for the amount threshold affecting auto assigned status
    @Test
    void claimOf5000OrLessShouldBeApproved() {
        
        CreateClaimRequest request = new CreateClaimRequest();
        request.setCustomerName("Ahmed");
        request.setDescription("Car accident");
        request.setAmount(new BigDecimal("5000"));

        //createClaim() calls claimRepository.save(), and our repository is a Mockito mock. We need to tell Mockito what save() should return
        //Whenever claimRepository.save() is called with any Claim, just give me that same Claim back
        when(claimRepository.save(any(Claim.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Claim result = claimService.createClaim(request);

        assertEquals(ClaimStatus.APPROVED, result.getStatus());

    }

    @Test
    void claimAbove5000ShouldBeUnderReview() {

        CreateClaimRequest request = new CreateClaimRequest();
        request.setCustomerName("Ahmed");
        request.setDescription("Major car accident");
        request.setAmount(new BigDecimal("7500"));

        when(claimRepository.save(any(Claim.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Claim result = claimService.createClaim(request);

        assertEquals(ClaimStatus.UNDER_REVIEW, result.getStatus());
    }

    //testing error handling (for requesting a claim id that doesnt exist)
    @Test
    void gettingNonexistentClaimShouldThrowException() {

        when(claimRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(
            ClaimNotFoundException.class,
            () -> claimService.getClaimById(999L)
        );
    }


}