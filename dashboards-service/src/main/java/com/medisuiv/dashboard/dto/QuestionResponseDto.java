package com.medisuiv.dashboard.dto;

public record QuestionResponseDto(
        Long id,
        String text,
        String type,
        boolean required,
        int position
) {
}
