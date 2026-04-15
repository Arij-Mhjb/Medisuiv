package com.medisuiv.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VitalSignsDTO {
    private Long id;
    private Long patientId;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperature;
    private Integer respiratoryRate;
    private Double weight;
    private Double height;
    private String notes;
    private LocalDateTime recordedAt;
    private Boolean submittedToDoctor;
}
