package com.medisuiv.dashboard.controller;

import com.medisuiv.dashboard.document.DashboardSnapshot;
import com.medisuiv.dashboard.dto.DashboardOverviewResponse;
import com.medisuiv.dashboard.service.DashboardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
    public DashboardOverviewResponse getOverview() {
        return dashboardService.getLiveOverview();
    }

    @PostMapping("/snapshots")
    @ResponseStatus(HttpStatus.CREATED)
    public DashboardSnapshot createSnapshot() {
        return dashboardService.createSnapshot();
    }

    @GetMapping("/snapshots")
    public List<DashboardSnapshot> getSnapshots() {
        return dashboardService.getSnapshots();
    }
}
