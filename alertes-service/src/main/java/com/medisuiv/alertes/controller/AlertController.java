package com.medisuiv.alertes.controller;

import com.medisuiv.alertes.model.Alert;
import com.medisuiv.alertes.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alertes")
@RequiredArgsConstructor
public class AlertController {
    private final AlertRepository alertRepository;

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertRepository.findAll());
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Alert>> getUnreadAlerts() {
        return ResponseEntity.ok(alertRepository.findByIsReadFalse());
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Alert>> getAlertsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(alertRepository.findBySeverity(severity));
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestParam String type,
                                             @RequestParam String message,
                                             @RequestParam String severity) {
        Alert alert = new Alert();
        alert.setType(type);
        alert.setMessage(message);
        alert.setSeverity(severity);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setIsRead(false);
        
        Alert savedAlert = alertRepository.save(alert);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAlert);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Alert> markAsRead(@PathVariable Long id) {
        return alertRepository.findById(id)
                .map(alert -> {
                    alert.setIsRead(true);
                    return ResponseEntity.ok(alertRepository.save(alert));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
