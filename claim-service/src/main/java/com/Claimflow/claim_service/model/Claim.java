package com.Claimflow.claim_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDateTime;
import java.math.BigDecimal;




@Entity
public class Claim {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //database should generate the id automatically 
    private Long id;

    private String customerName;
    private String description;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private LocalDateTime createdAt;


    //getters
    public String getCustomerName() {
        return customerName;
    }

    public String getDescription() {
        return description;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    

    //setters
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}