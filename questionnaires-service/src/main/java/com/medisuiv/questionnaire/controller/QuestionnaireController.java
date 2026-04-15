package com.medisuiv.questionnaire.controller;

import com.medisuiv.questionnaire.dto.CreateQuestionnaireRequest;
import com.medisuiv.questionnaire.dto.QuestionnaireDetailsResponse;
import com.medisuiv.questionnaire.dto.QuestionnaireStatsResponse;
import com.medisuiv.questionnaire.dto.QuestionnaireSummaryResponse;
import com.medisuiv.questionnaire.dto.ResponseTrendResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public QuestionnaireDetailsResponse create(@Valid @RequestBody CreateQuestionnaireRequest request) {
        return questionnaireService.createQuestionnaire(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public QuestionnaireDetailsResponse update(@PathVariable Long id,
                                               @Valid @RequestBody CreateQuestionnaireRequest request) {
        return questionnaireService.updateQuestionnaire(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        questionnaireService.deleteQuestionnaire(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','ANALYST')")
    public List<QuestionnaireSummaryResponse> findAll(@RequestParam(required = false) String status,
                                                      @RequestParam(required = false) String targetRole) {
        return questionnaireService.getQuestionnaires(status, targetRole);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','ANALYST')")
    public QuestionnaireDetailsResponse findById(@PathVariable Long id) {
        return questionnaireService.getQuestionnaire(id);
    }

    @PostMapping("/{id}/responses")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public QuestionnaireDetailsResponse submitResponse(@PathVariable Long id,
                                                       @Valid @RequestBody SubmitResponseRequest request) {
        return questionnaireService.submitResponses(id, request);
    }

    @GetMapping("/stats/overview")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','ANALYST')")
    public QuestionnaireStatsResponse getOverview() {
        return questionnaireService.getOverview();
    }

    @GetMapping("/stats/trends")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public List<ResponseTrendResponse> getResponseTrends() {
        return questionnaireService.getResponseTrends();
    }
}
