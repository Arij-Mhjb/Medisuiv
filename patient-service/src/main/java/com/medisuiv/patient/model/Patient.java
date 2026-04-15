package com.medisuiv.patient.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private Questionnaire questionnaire;

    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @Column(name = "approved_by_doctor_id")
    private Long approvedByDoctorId;

    @Column(name = "assigned_doctor_id")
    private Long assignedDoctorId;

    private LocalDateTime approvedAt;
}
