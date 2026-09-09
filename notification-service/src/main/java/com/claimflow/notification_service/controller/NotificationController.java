package com.claimflow.notification_service.controller;

import com.claimflow.notification_service.dto.NotificationRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @PostMapping
    public String sendNotification(@RequestBody NotificationRequest request) {

        System.out.println(
            "Notification: Claim " + request.getClaimId()
            + " is now " + request.getStatus()
        );

        return "Notification sent";
    }
}