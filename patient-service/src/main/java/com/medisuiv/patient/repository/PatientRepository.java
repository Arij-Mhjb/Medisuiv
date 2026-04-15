package com.medisuiv.patient.repository;

import com.medisuiv.patient.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);

    @Query("SELECT p FROM Patient p WHERE p.isApproved = false")
    List<Patient> findAllPendingPatients();

    @Query("SELECT p FROM Patient p WHERE p.isApproved = true AND p.assignedDoctorId = ?1")
    List<Patient> findApprovedPatientsByDoctorId(Long doctorId);
}
