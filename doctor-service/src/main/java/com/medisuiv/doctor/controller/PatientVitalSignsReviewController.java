package com.medisuiv.doctor.controller;

import com.medisuiv.doctor.dto.PatientVitalSignsReviewDTO;
import com.medisuiv.doctor.service.PatientVitalSignsReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vital-signs-review")
@RequiredArgsConstructor
public class PatientVitalSignsReviewController {
    private final PatientVitalSignsReviewService reviewService;

    /**
     * Create a vital signs review
     */
    @PostMapping("/create")
    public ResponseEntity<?> createVitalSignsReview(@RequestParam Long patientId,
                                                     @RequestParam Long vitalSignsId,
                                                     @RequestParam Long doctorId,
                                                     @RequestParam Integer bloodPressureSystolic,
                                                     @RequestParam Integer bloodPressureDiastolic,
                                                     @RequestParam Integer heartRate,
                                                     @RequestParam Double temperature,
                                                     @RequestParam Integer respiratoryRate,
                                                     @RequestParam Double weight,
                                                     @RequestParam Double height,
                                                     @RequestParam String recordedAt) {
        try {
            PatientVitalSignsReviewDTO review = reviewService.createVitalSignsReview(
                    patientId, vitalSignsId, doctorId, bloodPressureSystolic, bloodPressureDiastolic,
                    heartRate, temperature, respiratoryRate, weight, height,
                    LocalDateTime.parse(recordedAt));
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating vital signs review: " + e.getMessage());
        }
    }

    /**
     * Get all vital signs reviews for a doctor
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PatientVitalSignsReviewDTO>> getVitalSignsReviewsByDoctorId(@PathVariable Long doctorId) {
        List<PatientVitalSignsReviewDTO> reviews = reviewService.getVitalSignsReviewsByDoctorId(doctorId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get unreviewed vital signs for a doctor
     */
    @GetMapping("/doctor/{doctorId}/unreviewed")
    public ResponseEntity<List<PatientVitalSignsReviewDTO>> getUnreviewedVitalSigns(@PathVariable Long doctorId) {
        List<PatientVitalSignsReviewDTO> reviews = reviewService.getUnreviewedVitalSignsForDoctor(doctorId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get vital signs reviews for a patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PatientVitalSignsReviewDTO>> getVitalSignsReviewsByPatientId(@PathVariable Long patientId) {
        List<PatientVitalSignsReviewDTO> reviews = reviewService.getVitalSignsReviewsByPatientId(patientId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get vital signs reviews for a patient by a specific doctor
     */
    @GetMapping("/patient/{patientId}/doctor/{doctorId}")
    public ResponseEntity<List<PatientVitalSignsReviewDTO>> getVitalSignsReviewsByPatientAndDoctor(
            @PathVariable Long patientId, @PathVariable Long doctorId) {
        List<PatientVitalSignsReviewDTO> reviews = reviewService.getVitalSignsReviewsByPatientAndDoctor(patientId, doctorId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Review vital signs
     */
    @PutMapping("/{reviewId}/review")
    public ResponseEntity<?> reviewVitalSigns(@PathVariable Long reviewId,
                                              @RequestParam String doctorNotes) {
        try {
            PatientVitalSignsReviewDTO review = reviewService.reviewVitalSigns(reviewId, doctorNotes);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error reviewing vital signs: " + e.getMessage());
        }
    }
}
