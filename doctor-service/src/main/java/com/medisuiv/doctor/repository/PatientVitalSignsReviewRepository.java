package com.medisuiv.doctor.repository;

import com.medisuiv.doctor.model.PatientVitalSignsReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientVitalSignsReviewRepository extends JpaRepository<PatientVitalSignsReview, Long> {
    List<PatientVitalSignsReview> findByDoctorId(Long doctorId);

    List<PatientVitalSignsReview> findByPatientId(Long patientId);

    List<PatientVitalSignsReview> findByPatientIdAndDoctorId(Long patientId, Long doctorId);

    List<PatientVitalSignsReview> findByDoctorIdAndIsReviewedFalse(Long doctorId);
}
