package com.medisuiv.dashboard.controller;

import com.medisuiv.dashboard.document.MedicalEventProjection;
import com.medisuiv.dashboard.dto.DashboardDrillDownResponse;
import com.medisuiv.dashboard.document.DashboardSnapshot;
import com.medisuiv.dashboard.dto.DashboardOverviewResponse;
import com.medisuiv.dashboard.dto.QuestionnaireSummaryResponse;
import com.medisuiv.dashboard.dto.ResponseTrendResponse;
import com.medisuiv.dashboard.service.DashboardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboards")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','DOCTOR')")
    public DashboardOverviewResponse getOverview() {
        return dashboardService.getLiveOverview();
    }

    @PostMapping("/snapshots")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public DashboardSnapshot createSnapshot() {
        return dashboardService.createSnapshot();
    }

    @GetMapping("/snapshots")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','DOCTOR')")
    public List<DashboardSnapshot> getSnapshots() {
        return dashboardService.getSnapshots();
    }

    @GetMapping("/questionnaires/{id}/drilldown")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST','DOCTOR')")
    public DashboardDrillDownResponse getDrillDown(@PathVariable Long id) {
        return dashboardService.getDrillDown(id);
    }

    @GetMapping("/questionnaires/published")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public List<QuestionnaireSummaryResponse> getPublishedQuestionnaires() {
        return dashboardService.getPublishedQuestionnaires();
    }

    @GetMapping("/trends")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public List<ResponseTrendResponse> getTrends() {
        return dashboardService.getResponseTrends();
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public List<MedicalEventProjection> getRecentEvents() {
        return dashboardService.getRecentEvents();
    }
}
