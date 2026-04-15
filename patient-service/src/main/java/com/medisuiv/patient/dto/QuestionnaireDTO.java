package com.medisuiv.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionnaireDTO {
    private Long id;
    private Long patientId;
    private String specialty;
    private String symptoms;
    private String medicalHistory;
    private String currentMedications;
    private LocalDateTime completedAt;
}
