package com.medisuiv.dashboard.dto;

import java.time.LocalDateTime;

public record DashboardOverviewResponse(
        long totalQuestionnaires,
        long totalQuestions,
        long totalResponses,
        double averageResponsesPerQuestionnaire,
        LocalDateTime lastSubmissionAt,
        String medicalEvaluation
) {
}
