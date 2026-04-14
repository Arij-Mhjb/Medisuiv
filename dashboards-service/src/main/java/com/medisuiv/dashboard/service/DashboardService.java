package com.medisuiv.dashboard.service;

import com.medisuiv.dashboard.client.QuestionnaireClient;
import com.medisuiv.dashboard.document.DashboardSnapshot;
import com.medisuiv.dashboard.dto.DashboardOverviewResponse;
import com.medisuiv.dashboard.dto.QuestionnaireStatsResponse;
import com.medisuiv.dashboard.repository.DashboardSnapshotRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final QuestionnaireClient questionnaireClient;
    private final DashboardSnapshotRepository dashboardSnapshotRepository;

    public DashboardOverviewResponse getLiveOverview() {
        QuestionnaireStatsResponse stats = questionnaireClient.getOverview();
        return new DashboardOverviewResponse(
                stats.totalQuestionnaires(),
                stats.totalQuestions(),
                stats.totalResponses(),
                stats.averageResponsesPerQuestionnaire(),
                stats.lastSubmissionAt(),
                evaluate(stats)
        );
    }

    public DashboardSnapshot createSnapshot() {
        QuestionnaireStatsResponse stats = questionnaireClient.getOverview();
        DashboardSnapshot snapshot = DashboardSnapshot.builder()
                .totalQuestionnaires(stats.totalQuestionnaires())
                .totalQuestions(stats.totalQuestions())
                .totalResponses(stats.totalResponses())
                .averageResponsesPerQuestionnaire(stats.averageResponsesPerQuestionnaire())
                .lastSubmissionAt(stats.lastSubmissionAt())
                .medicalEvaluation(evaluate(stats))
                .generatedAt(LocalDateTime.now())
                .build();
        return dashboardSnapshotRepository.save(snapshot);
    }

    public List<DashboardSnapshot> getSnapshots() {
        return dashboardSnapshotRepository.findAllByOrderByGeneratedAtDesc();
    }

    private String evaluate(QuestionnaireStatsResponse stats) {
        if (stats.totalResponses() == 0) {
            return "Aucune reponse recueillie: suivi patient a renforcer.";
        }
        if (stats.averageResponsesPerQuestionnaire() < 3) {
            return "Participation faible: relancer les patients a risque.";
        }
        return "Suivi actif: les donnees permettent une evaluation medicale continue.";
    }
}
