package com.medisuiv.patient.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "questionnaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Questionnaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String specialty;

    @Column(length = 500)
    private String symptoms;

    @Column(length = 500)
    private String medicalHistory;

    @Column(length = 500)
    private String currentMedications;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    @Column(name = "is_visible_to_doctors")
    private Boolean isVisibleToDoctors = true;
}
