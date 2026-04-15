package com.medisuiv.questionnaire.dto;

public record QuestionnaireSummaryResponse(
        Long id,
        String title,
        String targetRole,
        String status,
        long totalResponses
) {
}
