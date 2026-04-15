package com.medisuiv.doctor.repository;

import com.medisuiv.doctor.model.PatientApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientApprovalRepository extends JpaRepository<PatientApproval, Long> {
    
    @Query("SELECT pa FROM PatientApproval pa WHERE pa.doctorId = ?1 AND pa.status = 'PENDING'")
    List<PatientApproval> findPendingApprovalsByDoctorId(Long doctorId);

    @Query("SELECT pa FROM PatientApproval pa WHERE pa.specialty = ?1 AND pa.status = 'PENDING'")
    List<PatientApproval> findPendingApprovalsBySpecialty(String specialty);

    @Query("SELECT pa FROM PatientApproval pa WHERE pa.doctorId = ?1 AND pa.status = 'APPROVED'")
    List<PatientApproval> findApprovedPatientsByDoctorId(Long doctorId);

    List<PatientApproval> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
}
