package com.medisuiv.questionnaire.dto;

public record ResponseTrendResponse(
        Long questionnaireId,
        String questionnaireTitle,
        long totalResponses
) {
}
