package com.medisuiv.dashboard.dto;

public record DashboardDrillDownResponse(
        QuestionnaireDetailsResponse questionnaire,
        String careRecommendation
) {
}
