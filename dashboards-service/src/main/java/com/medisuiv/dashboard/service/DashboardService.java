package com.medisuiv.dashboard.service;

import com.medisuiv.dashboard.client.QuestionnaireClient;
import com.medisuiv.dashboard.document.DashboardSnapshot;
import com.medisuiv.dashboard.document.MedicalEventProjection;
import com.medisuiv.dashboard.dto.DashboardDrillDownResponse;
import com.medisuiv.dashboard.dto.DashboardOverviewResponse;
import com.medisuiv.dashboard.dto.QuestionnaireDetailsResponse;
import com.medisuiv.dashboard.dto.QuestionnaireSummaryResponse;
import com.medisuiv.dashboard.dto.QuestionnaireStatsResponse;
import com.medisuiv.dashboard.dto.ResponseTrendResponse;
import com.medisuiv.dashboard.repository.DashboardSnapshotRepository;
import com.medisuiv.dashboard.repository.MedicalEventProjectionRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final QuestionnaireClient questionnaireClient;
    private final DashboardSnapshotRepository dashboardSnapshotRepository;
    private final MedicalEventProjectionRepository eventProjectionRepository;

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

    public DashboardDrillDownResponse getDrillDown(Long questionnaireId) {
        QuestionnaireDetailsResponse details = questionnaireClient.getQuestionnaire(questionnaireId);
        String recommendation = details.totalResponses() < 3
                ? "Relancer rapidement les patients pour enrichir les donnees cliniques."
                : "Maintenir la cadence de collecte et surveiller les cas critiques.";
        return new DashboardDrillDownResponse(details, recommendation);
    }

    public List<QuestionnaireSummaryResponse> getPublishedQuestionnaires() {
        return questionnaireClient.getQuestionnairesByStatus("PUBLISHED");
    }

    public List<ResponseTrendResponse> getResponseTrends() {
        return questionnaireClient.getResponseTrends();
    }

    public List<MedicalEventProjection> getRecentEvents() {
        return eventProjectionRepository.findTop10ByOrderByOccurredAtDesc();
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
