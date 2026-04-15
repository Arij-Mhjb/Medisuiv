package com.medisuiv.notification.repository;

import com.medisuiv.notification.entity.NotificationDispatch;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationDispatchRepository extends JpaRepository<NotificationDispatch, Long> {

    List<NotificationDispatch> findTop20ByOrderByProcessedAtDesc();
}
