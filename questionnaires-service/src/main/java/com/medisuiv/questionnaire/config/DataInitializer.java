package com.medisuiv.questionnaire.config;

import com.medisuiv.questionnaire.dto.CreateQuestionnaireRequest;
import com.medisuiv.questionnaire.dto.QuestionDefinitionRequest;
import com.medisuiv.questionnaire.repository.QuestionnaireRepository;
import com.medisuiv.questionnaire.service.QuestionnaireService;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedQuestionnaires(QuestionnaireRepository questionnaireRepository,
                                         QuestionnaireService questionnaireService) {
        return args -> {
            if (questionnaireRepository.count() > 0) {
                return;
            }

            questionnaireService.createQuestionnaire(new CreateQuestionnaireRequest(
                    "Suivi post-hospitalisation",
                    "Questionnaire quotidien pour evaluer l'etat du patient apres sortie.",
                    "DOCTOR",
                    "PUBLISHED",
                    List.of(
                            new QuestionDefinitionRequest("Comment evaluez-vous votre douleur aujourd'hui ?", "TEXT", true, 1),
                            new QuestionDefinitionRequest("Avez-vous pris votre traitement aujourd'hui ?", "BOOLEAN", true, 2),
                            new QuestionDefinitionRequest("Indiquez votre niveau de fatigue sur 10.", "NUMBER", true, 3)
                    )
            ));

            questionnaireService.createQuestionnaire(new CreateQuestionnaireRequest(
                    "Controle diabetologie",
                    "Questionnaire hebdomadaire pour les patients diabetiques.",
                    "DOCTOR",
                    "PUBLISHED",
                    List.of(
                            new QuestionDefinitionRequest("Votre glycemie moyenne cette semaine ?", "NUMBER", true, 1),
                            new QuestionDefinitionRequest("Avez-vous respecte le regime alimentaire ?", "BOOLEAN", true, 2)
                    )
            ));
        };
    }
}
