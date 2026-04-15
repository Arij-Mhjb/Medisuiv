package com.medisuiv.doctor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_vital_signs_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientVitalSignsReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(name = "vital_signs_id", nullable = false)
    private Long vitalSignsId;

    @Column(nullable = false)
    private Long doctorId;

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

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @Column(length = 1000)
    private String doctorNotes;

    @Column(name = "is_reviewed")
    private Boolean isReviewed = false;

    @Column(nullable = false)
    private LocalDateTime reviewedAt;
}
