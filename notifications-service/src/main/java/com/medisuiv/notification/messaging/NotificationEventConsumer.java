package com.medisuiv.notification.messaging;

import com.medisuiv.notification.config.MessagingConfig;
import com.medisuiv.notification.service.NotificationService;
import com.medisuiv.notification.event.MedicalEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = MessagingConfig.NOTIFICATION_QUEUE)
    public void consume(MedicalEvent event) {
        notificationService.registerEvent(event);
    }
}
