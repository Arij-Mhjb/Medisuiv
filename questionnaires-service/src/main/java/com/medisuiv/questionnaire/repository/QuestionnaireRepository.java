package com.medisuiv.questionnaire.repository;

import com.medisuiv.questionnaire.entity.Questionnaire;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    List<Questionnaire> findByStatusIgnoreCase(String status);

    List<Questionnaire> findByTargetRoleIgnoreCase(String targetRole);
}
