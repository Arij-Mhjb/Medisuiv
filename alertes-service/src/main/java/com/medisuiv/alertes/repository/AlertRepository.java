package com.medisuiv.alertes.repository;

import com.medisuiv.alertes.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsReadFalse();
    List<Alert> findBySeverity(String severity);
}
