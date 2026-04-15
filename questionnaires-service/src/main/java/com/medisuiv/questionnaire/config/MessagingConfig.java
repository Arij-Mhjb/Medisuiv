package com.medisuiv.questionnaire.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfig {

    public static final String EXCHANGE = "medical.events";
    public static final String DASHBOARD_QUEUE = "dashboard.events.queue";
    public static final String NOTIFICATION_QUEUE = "notification.events.queue";

    @Bean
    Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    DirectExchange medicalExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    Queue dashboardQueue() {
        return QueueBuilder.durable(DASHBOARD_QUEUE).build();
    }

    @Bean
    Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE).build();
    }

    @Bean
    Binding dashboardQuestionnaireCreatedBinding(Queue dashboardQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(dashboardQueue).to(medicalExchange).with("questionnaire.created");
    }

    @Bean
    Binding dashboardQuestionnaireUpdatedBinding(Queue dashboardQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(dashboardQueue).to(medicalExchange).with("questionnaire.updated");
    }

    @Bean
    Binding dashboardResponseSubmittedBinding(Queue dashboardQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(dashboardQueue).to(medicalExchange).with("questionnaire.response.submitted");
    }

    @Bean
    Binding notificationQuestionnaireCreatedBinding(Queue notificationQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(notificationQueue).to(medicalExchange).with("questionnaire.created");
    }

    @Bean
    Binding notificationQuestionnaireUpdatedBinding(Queue notificationQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(notificationQueue).to(medicalExchange).with("questionnaire.updated");
    }

    @Bean
    Binding notificationResponseSubmittedBinding(Queue notificationQueue, DirectExchange medicalExchange) {
        return BindingBuilder.bind(notificationQueue).to(medicalExchange).with("questionnaire.response.submitted");
    }
}
