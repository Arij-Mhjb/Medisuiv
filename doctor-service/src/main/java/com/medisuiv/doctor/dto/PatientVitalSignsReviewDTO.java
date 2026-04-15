package com.medisuiv.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientVitalSignsReviewDTO {
    private Long id;
    private Long patientId;
    private Long vitalSignsId;
    private Long doctorId;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperature;
    private Integer respiratoryRate;
    private Double weight;
    private Double height;
    private LocalDateTime recordedAt;
    private String doctorNotes;
    private Boolean isReviewed;
    private LocalDateTime reviewedAt;
}
