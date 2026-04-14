package com.medisuiv.questionnaire.repository;

import com.medisuiv.questionnaire.entity.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuestionnaire_IdOrderByPositionAsc(Long questionnaireId);
}
