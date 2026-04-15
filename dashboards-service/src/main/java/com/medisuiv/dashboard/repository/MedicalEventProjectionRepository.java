package com.medisuiv.dashboard.repository;

import com.medisuiv.dashboard.document.MedicalEventProjection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedicalEventProjectionRepository extends MongoRepository<MedicalEventProjection, String> {

    List<MedicalEventProjection> findTop10ByOrderByOccurredAtDesc();
}
