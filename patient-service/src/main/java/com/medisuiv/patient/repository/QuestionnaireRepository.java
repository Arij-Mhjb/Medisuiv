package com.medisuiv.patient.repository;

import com.medisuiv.patient.model.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    Optional<Questionnaire> findByPatientId(Long patientId);

    List<Questionnaire> findBySpecialty(String specialty);
}
