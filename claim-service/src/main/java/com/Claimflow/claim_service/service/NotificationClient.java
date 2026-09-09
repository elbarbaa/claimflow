package com.Claimflow.claim_service.service;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient() {
        this.restClient = RestClient.create("http://localhost:8081");
    }

    public void sendNotification(Long claimId, String status) {
        restClient.post()
                .uri("/api/notifications")
                .body(
                    Map.of(
                        "claimId", claimId,
                        "status", status
                    )
                )
                .retrieve()
                .toBodilessEntity();
    }
}