package com.medisuiv.dashboard.dto;

import java.time.LocalDateTime;
import java.util.List;

public record QuestionnaireDetailsResponse(
        Long id,
        String title,
        String description,
        String targetRole,
        String status,
        int questionCount,
        long totalResponses,
        LocalDateTime lastSubmissionAt,
        List<QuestionResponseDto> questions
) {
}
