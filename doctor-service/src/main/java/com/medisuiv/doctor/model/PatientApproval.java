package com.medisuiv.doctor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(name = "patient_email", nullable = false)
    private String patientEmail;

    @Column(name = "patient_first_name", nullable = false)
    private String patientFirstName;

    @Column(name = "patient_last_name", nullable = false)
    private String patientLastName;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private String doctorEmail;

    @Column(nullable = false)
    private String specialty;

    @Column(nullable = false)
    private String symptoms;

    @Column(length = 500)
    private String medicalHistory;

    @Column(length = 500)
    private String currentMedications;

    @Column(name = "approval_status")
    private String status; // PENDING, APPROVED, REJECTED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    @Column(length = 500)
    private String notes;
}
