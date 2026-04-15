package com.medisuiv.notification.service;

import com.medisuiv.notification.dto.NotificationDispatchResponse;
import com.medisuiv.notification.entity.NotificationDispatch;
import com.medisuiv.notification.event.MedicalEvent;
import com.medisuiv.notification.repository.NotificationDispatchRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationDispatchRepository notificationDispatchRepository;

    public void registerEvent(MedicalEvent event) {
        notificationDispatchRepository.save(NotificationDispatch.builder()
                .channel(resolveChannel(event.eventType()))
                .recipientRole(event.targetRole())
                .message(buildMessage(event))
                .sourceEvent(event.eventType())
                .processedAt(LocalDateTime.now())
                .build());
    }

    public List<NotificationDispatchResponse> getRecentNotifications() {
        return notificationDispatchRepository.findTop20ByOrderByProcessedAtDesc().stream()
                .map(entity -> new NotificationDispatchResponse(
                        entity.getId(),
                        entity.getChannel(),
                        entity.getRecipientRole(),
                        entity.getMessage(),
                        entity.getSourceEvent(),
                        entity.getProcessedAt()))
                .toList();
    }

    private String resolveChannel(String eventType) {
        return switch (eventType) {
            case "questionnaire.created" -> "EMAIL";
            case "questionnaire.updated" -> "TEAMS";
            case "questionnaire.response.submitted" -> "SMS";
            default -> "IN_APP";
        };
    }

    private String buildMessage(MedicalEvent event) {
        return "Event " + event.eventType() + " for questionnaire '" + event.questionnaireTitle()
                + "' handled for role " + event.targetRole() + ".";
    }
}
