package com.medisuiv.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDateTime createdAt;
    private Boolean isApproved;
    private Long assignedDoctorId;
    private LocalDateTime approvedAt;
    private QuestionnaireDTO questionnaire;
}
