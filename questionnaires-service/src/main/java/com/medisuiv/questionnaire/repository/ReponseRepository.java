package com.medisuiv.questionnaire.repository;

import com.medisuiv.questionnaire.entity.Reponse;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {

    long countByQuestionnaireId(Long questionnaireId);

    @Query("select max(r.submittedAt) from Reponse r")
    LocalDateTime findLastSubmissionAt();

    @Query("select max(r.submittedAt) from Reponse r where r.questionnaireId = :questionnaireId")
    LocalDateTime findLastSubmissionAtByQuestionnaireId(Long questionnaireId);
}
