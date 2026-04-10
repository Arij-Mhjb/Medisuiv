package com.medisuiv.alertes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // GET all notifications
    @GetMapping
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    // GET one notification by id
    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    // POST create new notification
    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return notificationRepository.save(notification);
    }

    // PUT update notification
    @PutMapping("/{id}")
    public Notification update(@PathVariable Long id, @RequestBody Notification notification) {
        notification.setId(id);
        return notificationRepository.save(notification);
    }

    // DELETE notification
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        notificationRepository.deleteById(id);
    }
}