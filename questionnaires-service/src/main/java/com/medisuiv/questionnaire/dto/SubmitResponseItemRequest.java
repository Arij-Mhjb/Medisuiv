package com.medisuiv.questionnaire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmitResponseItemRequest(
        @NotNull Long questionId,
        @NotBlank String answerText,
        Integer score
) {
}
