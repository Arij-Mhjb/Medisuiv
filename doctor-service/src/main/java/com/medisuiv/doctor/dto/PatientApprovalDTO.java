package com.medisuiv.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientApprovalDTO {
    private Long id;
    private Long patientId;
    private String patientEmail;
    private String patientFirstName;
    private String patientLastName;
    private Long doctorId;
    private String specialty;
    private String symptoms;
    private String medicalHistory;
    private String currentMedications;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private String notes;
}
