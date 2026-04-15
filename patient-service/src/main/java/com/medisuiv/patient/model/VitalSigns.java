package com.medisuiv.patient.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VitalSigns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Integer bloodPressureSystolic;

    @Column(nullable = false)
    private Integer bloodPressureDiastolic;

    @Column(nullable = false)
    private Integer heartRate;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Integer respiratoryRate;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Double height;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "submitted_to_doctor")
    private Boolean submittedToDoctor = false;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}
