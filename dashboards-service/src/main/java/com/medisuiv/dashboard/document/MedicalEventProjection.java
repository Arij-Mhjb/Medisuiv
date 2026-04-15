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
@Document(collection = "medical_event_projections")
public class MedicalEventProjection {

    @Id
    private String id;

    private String eventType;
    private Long questionnaireId;
    private String questionnaireTitle;
    private String targetRole;
    private String actor;
    private String payload;
    private LocalDateTime occurredAt;
}
