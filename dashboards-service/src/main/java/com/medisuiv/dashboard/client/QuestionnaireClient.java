package com.medisuiv.dashboard.client;

import com.medisuiv.dashboard.dto.QuestionnaireStatsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "questionnaires-service", path = "/api/questionnaires")
public interface QuestionnaireClient {

    @GetMapping("/stats/overview")
    QuestionnaireStatsResponse getOverview();
}
