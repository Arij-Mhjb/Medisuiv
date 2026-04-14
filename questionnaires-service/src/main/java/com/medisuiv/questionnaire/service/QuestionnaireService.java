package com.medisuiv.questionnaire.service;

import com.medisuiv.questionnaire.dto.CreateQuestionnaireRequest;
import com.medisuiv.questionnaire.dto.QuestionResponseDto;
import com.medisuiv.questionnaire.dto.QuestionnaireDetailsResponse;
import com.medisuiv.questionnaire.dto.QuestionnaireStatsResponse;
import com.medisuiv.questionnaire.dto.SubmitResponseItemRequest;
import com.medisuiv.questionnaire.dto.SubmitResponseRequest;
import com.medisuiv.questionnaire.entity.Question;
import com.medisuiv.questionnaire.entity.Questionnaire;
import com.medisuiv.questionnaire.entity.Reponse;
import com.medisuiv.questionnaire.repository.QuestionRepository;
import com.medisuiv.questionnaire.repository.QuestionnaireRepository;
import com.medisuiv.questionnaire.repository.ReponseRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;
    private final ReponseRepository reponseRepository;

    @Transactional
    public QuestionnaireDetailsResponse createQuestionnaire(CreateQuestionnaireRequest request) {
        Questionnaire questionnaire = Questionnaire.builder()
                .title(request.title())
                .description(request.description())
                .targetRole(request.targetRole())
                .status(request.status())
                .build();

        List<Question> questions = request.questions().stream()
                .map(item -> Question.builder()
                        .text(item.text())
                        .type(item.type())
                        .required(item.required())
                        .position(item.position())
                        .questionnaire(questionnaire)
                        .build())
                .toList();

        questionnaire.setQuestions(questions);
        Questionnaire saved = questionnaireRepository.save(questionnaire);
        return toDetails(saved);
    }

    @Transactional
    public QuestionnaireDetailsResponse updateQuestionnaire(Long id, CreateQuestionnaireRequest request) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Questionnaire introuvable: " + id));

        questionnaire.setTitle(request.title());
        questionnaire.setDescription(request.description());
        questionnaire.setTargetRole(request.targetRole());
        questionnaire.setStatus(request.status());
        questionnaire.getQuestions().clear();

        List<Question> updatedQuestions = request.questions().stream()
                .map(item -> Question.builder()
                        .text(item.text())
                        .type(item.type())
                        .required(item.required())
                        .position(item.position())
                        .questionnaire(questionnaire)
                        .build())
                .toList();

        questionnaire.getQuestions().addAll(updatedQuestions);
        Questionnaire saved = questionnaireRepository.save(questionnaire);
        return toDetails(saved);
    }

    @Transactional
    public void deleteQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Questionnaire introuvable: " + id));
        questionnaireRepository.delete(questionnaire);
    }

    @Transactional(readOnly = true)
    public List<QuestionnaireDetailsResponse> getAllQuestionnaires() {
        return questionnaireRepository.findAll().stream()
                .map(this::toDetails)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuestionnaireDetailsResponse getQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Questionnaire introuvable: " + id));
        return toDetails(questionnaire);
    }

    @Transactional
    public QuestionnaireDetailsResponse submitResponses(Long questionnaireId, SubmitResponseRequest request) {
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new EntityNotFoundException("Questionnaire introuvable: " + questionnaireId));

        List<Long> allowedQuestionIds = questionRepository.findByQuestionnaire_IdOrderByPositionAsc(questionnaireId)
                .stream()
                .map(Question::getId)
                .toList();

        LocalDateTime now = LocalDateTime.now();
        List<Reponse> responses = request.responses().stream()
                .peek(item -> validateQuestion(item, allowedQuestionIds))
                .map(item -> mapResponse(questionnaireId, request.patientId(), now, item))
                .toList();

        reponseRepository.saveAll(responses);
        return toDetails(questionnaire);
    }

    @Transactional(readOnly = true)
    public QuestionnaireStatsResponse getOverview() {
        long totalQuestionnaires = questionnaireRepository.count();
        long totalQuestions = questionRepository.count();
        long totalResponses = reponseRepository.count();
        double average = totalQuestionnaires == 0 ? 0.0 : (double) totalResponses / totalQuestionnaires;

        return new QuestionnaireStatsResponse(
                totalQuestionnaires,
                totalQuestions,
                totalResponses,
                average,
                reponseRepository.findLastSubmissionAt()
        );
    }

    private void validateQuestion(SubmitResponseItemRequest item, List<Long> allowedQuestionIds) {
        if (!allowedQuestionIds.contains(item.questionId())) {
            throw new EntityNotFoundException("Question non rattachee au questionnaire: " + item.questionId());
        }
    }

    private Reponse mapResponse(Long questionnaireId,
                                String patientId,
                                LocalDateTime submittedAt,
                                SubmitResponseItemRequest item) {
        return Reponse.builder()
                .questionnaireId(questionnaireId)
                .questionId(item.questionId())
                .patientId(patientId)
                .answerText(item.answerText())
                .score(item.score())
                .submittedAt(submittedAt)
                .build();
    }

    private QuestionnaireDetailsResponse toDetails(Questionnaire questionnaire) {
        List<Question> questions = questionRepository.findByQuestionnaire_IdOrderByPositionAsc(questionnaire.getId());
        long totalResponses = reponseRepository.countByQuestionnaireId(questionnaire.getId());
        LocalDateTime lastSubmissionAt = reponseRepository.findLastSubmissionAtByQuestionnaireId(questionnaire.getId());

        return new QuestionnaireDetailsResponse(
                questionnaire.getId(),
                questionnaire.getTitle(),
                questionnaire.getDescription(),
                questionnaire.getTargetRole(),
                questionnaire.getStatus(),
                questions.size(),
                totalResponses,
                lastSubmissionAt,
                questions.stream()
                        .map(question -> new QuestionResponseDto(
                                question.getId(),
                                question.getText(),
                                question.getType(),
                                question.isRequired(),
                                question.getPosition()
                        ))
                        .toList()
        );
    }
}
