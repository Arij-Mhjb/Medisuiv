package com.medisuiv.questionnaire.event;

import java.time.LocalDateTime;

public record MedicalEvent(
        String eventType,
        Long questionnaireId,
        String questionnaireTitle,
        String targetRole,
        String actor,
        String payload,
        LocalDateTime occurredAt
) {
}
