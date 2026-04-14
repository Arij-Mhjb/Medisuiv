package com.medisuiv.questionnaire.controller;

import com.medisuiv.questionnaire.dto.CreateQuestionnaireRequest;
import com.medisuiv.questionnaire.dto.QuestionnaireDetailsResponse;
import com.medisuiv.questionnaire.dto.QuestionnaireStatsResponse;
import com.medisuiv.questionnaire.dto.SubmitResponseRequest;
import com.medisuiv.questionnaire.service.QuestionnaireService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionnaireDetailsResponse create(@Valid @RequestBody CreateQuestionnaireRequest request) {
        return questionnaireService.createQuestionnaire(request);
    }

    @PutMapping("/{id}")
    public QuestionnaireDetailsResponse update(@PathVariable Long id,
                                               @Valid @RequestBody CreateQuestionnaireRequest request) {
        return questionnaireService.updateQuestionnaire(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        questionnaireService.deleteQuestionnaire(id);
    }

    @GetMapping
    public List<QuestionnaireDetailsResponse> findAll() {
        return questionnaireService.getAllQuestionnaires();
    }

    @GetMapping("/{id}")
    public QuestionnaireDetailsResponse findById(@PathVariable Long id) {
        return questionnaireService.getQuestionnaire(id);
    }

    @PostMapping("/{id}/responses")
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionnaireDetailsResponse submitResponse(@PathVariable Long id,
                                                       @Valid @RequestBody SubmitResponseRequest request) {
        return questionnaireService.submitResponses(id, request);
    }

    @GetMapping("/stats/overview")
    public QuestionnaireStatsResponse getOverview() {
        return questionnaireService.getOverview();
    }
}
