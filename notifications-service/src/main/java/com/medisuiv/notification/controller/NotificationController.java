package com.medisuiv.notification.controller;

import com.medisuiv.notification.dto.NotificationDispatchResponse;
import com.medisuiv.notification.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public List<NotificationDispatchResponse> getNotifications() {
        return notificationService.getRecentNotifications();
    }
}
