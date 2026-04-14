package com.medisuiv.dashboard.repository;

import com.medisuiv.dashboard.document.DashboardSnapshot;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DashboardSnapshotRepository extends MongoRepository<DashboardSnapshot, String> {

    List<DashboardSnapshot> findAllByOrderByGeneratedAtDesc();
}
