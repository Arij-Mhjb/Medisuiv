package com.medisuiv.notification.dto;

import java.time.LocalDateTime;

public record NotificationDispatchResponse(
        Long id,
        String channel,
        String recipientRole,
        String message,
        String sourceEvent,
        LocalDateTime processedAt
) {
}
