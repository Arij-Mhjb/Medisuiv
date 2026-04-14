package com.medisuiv.dashboard.document;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "dashboard_snapshots")
public class DashboardSnapshot {

    @Id
    private String id;

    private long totalQuestionnaires;

    private long totalQuestions;

    private long totalResponses;

    private double averageResponsesPerQuestionnaire;

    private LocalDateTime lastSubmissionAt;

    private String medicalEvaluation;

    private LocalDateTime generatedAt;
}
