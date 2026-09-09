package com.Claimflow.claim_service.dto;

import com.Claimflow.claim_service.model.ClaimStatus;

public class UpdateClaimStatusRequest {

    private ClaimStatus status;

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }
}