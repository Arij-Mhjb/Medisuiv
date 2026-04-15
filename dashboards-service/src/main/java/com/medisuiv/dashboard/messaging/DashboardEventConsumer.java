package com.medisuiv.dashboard.messaging;

import com.medisuiv.dashboard.config.MessagingConfig;
import com.medisuiv.dashboard.document.MedicalEventProjection;
import com.medisuiv.dashboard.event.MedicalEvent;
import com.medisuiv.dashboard.repository.MedicalEventProjectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DashboardEventConsumer {

    private final MedicalEventProjectionRepository projectionRepository;

    @RabbitListener(queues = MessagingConfig.DASHBOARD_QUEUE)
    public void consume(MedicalEvent event) {
        projectionRepository.save(MedicalEventProjection.builder()
                .eventType(event.eventType())
                .questionnaireId(event.questionnaireId())
                .questionnaireTitle(event.questionnaireTitle())
                .targetRole(event.targetRole())
                .actor(event.actor())
                .payload(event.payload())
                .occurredAt(event.occurredAt())
                .build());
    }
}
