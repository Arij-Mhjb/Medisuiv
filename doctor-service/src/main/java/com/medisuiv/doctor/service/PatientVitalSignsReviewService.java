package com.medisuiv.doctor.service;

import com.medisuiv.doctor.dto.PatientVitalSignsReviewDTO;
import com.medisuiv.doctor.model.PatientVitalSignsReview;
import com.medisuiv.doctor.repository.PatientVitalSignsReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientVitalSignsReviewService {
    private final PatientVitalSignsReviewRepository vitalSignsReviewRepository;

    /**
     * Create a new vital signs review record
     */
    public PatientVitalSignsReviewDTO createVitalSignsReview(Long patientId, Long vitalSignsId, Long doctorId,
                                                               Integer bloodPressureSystolic, Integer bloodPressureDiastolic,
                                                               Integer heartRate, Double temperature, Integer respiratoryRate,
                                                               Double weight, Double height, LocalDateTime recordedAt) {
        PatientVitalSignsReview review = new PatientVitalSignsReview();
        review.setPatientId(patientId);
        review.setVitalSignsId(vitalSignsId);
        review.setDoctorId(doctorId);
        review.setBloodPressureSystolic(bloodPressureSystolic);
        review.setBloodPressureDiastolic(bloodPressureDiastolic);
        review.setHeartRate(heartRate);
        review.setTemperature(temperature);
        review.setRespiratoryRate(respiratoryRate);
        review.setWeight(weight);
        review.setHeight(height);
        review.setRecordedAt(recordedAt);
        review.setIsReviewed(false);
        review.setReviewedAt(LocalDateTime.now());

        PatientVitalSignsReview savedReview = vitalSignsReviewRepository.save(review);
        return mapToDTO(savedReview);
    }

    /**
     * Get all vital signs reviews for a doctor
     */
    public List<PatientVitalSignsReviewDTO> getVitalSignsReviewsByDoctorId(Long doctorId) {
        return vitalSignsReviewRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unreviewed vital signs for a doctor
     */
    public List<PatientVitalSignsReviewDTO> getUnreviewedVitalSignsForDoctor(Long doctorId) {
        return vitalSignsReviewRepository.findByDoctorIdAndIsReviewedFalse(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vital signs reviews for a patient
     */
    public List<PatientVitalSignsReviewDTO> getVitalSignsReviewsByPatientId(Long patientId) {
        return vitalSignsReviewRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vital signs reviews for a patient by a specific doctor
     */
    public List<PatientVitalSignsReviewDTO> getVitalSignsReviewsByPatientAndDoctor(Long patientId, Long doctorId) {
        return vitalSignsReviewRepository.findByPatientIdAndDoctorId(patientId, doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Review vital signs and add doctor notes
     */
    public PatientVitalSignsReviewDTO reviewVitalSigns(Long reviewId, String doctorNotes) {
        PatientVitalSignsReview review = vitalSignsReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Vital signs review not found"));

        review.setDoctorNotes(doctorNotes);
        review.setIsReviewed(true);

        PatientVitalSignsReview savedReview = vitalSignsReviewRepository.save(review);
        return mapToDTO(savedReview);
    }

    // Helper method
    private PatientVitalSignsReviewDTO mapToDTO(PatientVitalSignsReview review) {
        PatientVitalSignsReviewDTO dto = new PatientVitalSignsReviewDTO();
        dto.setId(review.getId());
        dto.setPatientId(review.getPatientId());
        dto.setVitalSignsId(review.getVitalSignsId());
        dto.setDoctorId(review.getDoctorId());
        dto.setBloodPressureSystolic(review.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(review.getBloodPressureDiastolic());
        dto.setHeartRate(review.getHeartRate());
        dto.setTemperature(review.getTemperature());
        dto.setRespiratoryRate(review.getRespiratoryRate());
        dto.setWeight(review.getWeight());
        dto.setHeight(review.getHeight());
        dto.setRecordedAt(review.getRecordedAt());
        dto.setDoctorNotes(review.getDoctorNotes());
        dto.setIsReviewed(review.getIsReviewed());
        dto.setReviewedAt(review.getReviewedAt());
        return dto;
    }
}
