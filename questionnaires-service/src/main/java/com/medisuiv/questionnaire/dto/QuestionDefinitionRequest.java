package com.medisuiv.questionnaire.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record QuestionDefinitionRequest(
        @NotBlank String text,
        @NotBlank String type,
        boolean required,
        @Min(1) int position
) {
}
