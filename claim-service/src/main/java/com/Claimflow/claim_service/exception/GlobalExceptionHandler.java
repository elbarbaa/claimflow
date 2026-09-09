package com.Claimflow.claim_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClaimNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleClaimNotFound(ClaimNotFoundException exception) {
        return exception.getMessage();
    }
}