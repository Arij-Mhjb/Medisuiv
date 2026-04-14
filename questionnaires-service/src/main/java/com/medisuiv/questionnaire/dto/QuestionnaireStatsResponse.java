package com.medisuiv.questionnaire.dto;

import java.time.LocalDateTime;

public record QuestionnaireStatsResponse(
        long totalQuestionnaires,
        long totalQuestions,
        long totalResponses,
        double averageResponsesPerQuestionnaire,
        LocalDateTime lastSubmissionAt
) {
}
