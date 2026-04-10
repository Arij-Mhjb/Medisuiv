package com.medisuiv.alertes;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlerteConsumer {

    @Autowired
    private AlerteRepository alerteRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ALERTES)
    public void handleVitalAlert(VitalAlertEvent event) {
        System.out.println("Event received: vital threshold exceeded for patient " + event.getPatientId());

        // Create an Alerte
        Alerte alerte = new Alerte();
        alerte.setType(event.getType());
        alerte.setPatientId(event.getPatientId());
        alerte.setNiveau("CRITIQUE");
        alerte.setMessage("Valeur " + event.getValeur() + " dépasse le seuil " + event.getSeuil());
        alerteRepository.save(alerte);

        // Create a Notification
        Notification notification = new Notification();
        notification.setContenu("Alerte critique: " + event.getType() + " pour patient " + event.getPatientId());
        notification.setDestinataire("Médecin responsable");
        notificationRepository.save(notification);

        System.out.println("Alerte and Notification created successfully!");
    }
}