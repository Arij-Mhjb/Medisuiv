package com.medisuiv.dashboard.dto;

public record ResponseTrendResponse(
        Long questionnaireId,
        String questionnaireTitle,
        long totalResponses
) {
}
