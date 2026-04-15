package com.medisuiv.questionnaire.service;

import com.medisuiv.questionnaire.config.MessagingConfig;
import com.medisuiv.questionnaire.event.MedicalEvent;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicalEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publish(String routingKey,
                        Long questionnaireId,
                        String questionnaireTitle,
                        String targetRole,
                        String actor,
                        String payload) {
        rabbitTemplate.convertAndSend(
                MessagingConfig.EXCHANGE,
                routingKey,
                new MedicalEvent(routingKey, questionnaireId, questionnaireTitle, targetRole, actor, payload, LocalDateTime.now())
        );
    }
}
