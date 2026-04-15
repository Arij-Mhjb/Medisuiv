package com.medisuiv.dashboard.dto;

public record QuestionnaireSummaryResponse(
        Long id,
        String title,
        String targetRole,
        String status,
        long totalResponses
) {
}
