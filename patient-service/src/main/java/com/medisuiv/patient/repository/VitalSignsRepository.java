package com.medisuiv.patient.repository;

import com.medisuiv.patient.model.VitalSigns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalSignsRepository extends JpaRepository<VitalSigns, Long> {
    List<VitalSigns> findByPatientId(Long patientId);

    List<VitalSigns> findByPatientIdOrderByRecordedAtDesc(Long patientId);
}
