package com.medisuiv.questionnaire.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateQuestionnaireRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String targetRole,
        @NotBlank String status,
        @NotEmpty List<@Valid QuestionDefinitionRequest> questions
) {
}
