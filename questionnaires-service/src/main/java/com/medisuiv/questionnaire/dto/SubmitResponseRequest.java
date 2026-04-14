package com.medisuiv.questionnaire.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record SubmitResponseRequest(
        @NotBlank String patientId,
        @NotEmpty List<@Valid SubmitResponseItemRequest> responses
) {
}
