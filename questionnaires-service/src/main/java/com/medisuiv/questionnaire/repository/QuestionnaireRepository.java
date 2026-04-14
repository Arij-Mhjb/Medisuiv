package com.medisuiv.questionnaire.repository;

import com.medisuiv.questionnaire.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
}
