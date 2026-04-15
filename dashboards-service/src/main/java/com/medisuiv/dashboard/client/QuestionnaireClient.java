package com.medisuiv.dashboard.client;

import com.medisuiv.dashboard.dto.QuestionnaireDetailsResponse;
import com.medisuiv.dashboard.dto.QuestionnaireSummaryResponse;
import com.medisuiv.dashboard.dto.QuestionnaireStatsResponse;
import com.medisuiv.dashboard.dto.ResponseTrendResponse;
import com.medisuiv.dashboard.config.FeignSecurityConfig;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "questionnaires-service", path = "/api/questionnaires", configuration = FeignSecurityConfig.class)
public interface QuestionnaireClient {

    @GetMapping("/stats/overview")
    QuestionnaireStatsResponse getOverview();

    @GetMapping("/{id}")
    QuestionnaireDetailsResponse getQuestionnaire(@PathVariable Long id);

    @GetMapping
    List<QuestionnaireSummaryResponse> getQuestionnairesByStatus(@RequestParam("status") String status);

    @GetMapping("/stats/trends")
    List<ResponseTrendResponse> getResponseTrends();
}
