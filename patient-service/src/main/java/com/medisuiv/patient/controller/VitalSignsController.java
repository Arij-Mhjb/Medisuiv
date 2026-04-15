package com.medisuiv.patient.controller;

import com.medisuiv.patient.dto.VitalSignsDTO;
import com.medisuiv.patient.service.VitalSignsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vital-signs")
@RequiredArgsConstructor
public class VitalSignsController {
    private final VitalSignsService vitalSignsService;

    /**
     * Record new vital signs
     */
    @PostMapping("/record")
    public ResponseEntity<?> recordVitalSigns(@RequestParam Long patientId,
                                              @RequestParam Integer bloodPressureSystolic,
                                              @RequestParam Integer bloodPressureDiastolic,
                                              @RequestParam Integer heartRate,
                                              @RequestParam Double temperature,
                                              @RequestParam Integer respiratoryRate,
                                              @RequestParam Double weight,
                                              @RequestParam Double height,
                                              @RequestParam(required = false) String notes) {
        try {
            VitalSignsDTO vitalSigns = vitalSignsService.recordVitalSigns(
                    patientId, bloodPressureSystolic, bloodPressureDiastolic, heartRate,
                    temperature, respiratoryRate, weight, height, notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(vitalSigns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error recording vital signs: " + e.getMessage());
        }
    }

    /**
     * Get all vital signs for a patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VitalSignsDTO>> getVitalSignsByPatientId(@PathVariable Long patientId) {
        List<VitalSignsDTO> vitalSigns = vitalSignsService.getVitalSignsByPatientId(patientId);
        return ResponseEntity.ok(vitalSigns);
    }

    /**
     * Get latest vital signs for a patient
     */
    @GetMapping("/patient/{patientId}/latest")
    public ResponseEntity<?> getLatestVitalSigns(@PathVariable Long patientId) {
        VitalSignsDTO vitalSigns = vitalSignsService.getLatestVitalSigns(patientId);
        if (vitalSigns != null) {
            return ResponseEntity.ok(vitalSigns);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No vital signs records found");
    }

    /**
     * Submit vital signs to doctor
     */
    @PutMapping("/{vitalSignsId}/submit-to-doctor")
    public ResponseEntity<?> submitVitalSignsToDoctor(@PathVariable Long vitalSignsId) {
        try {
            VitalSignsDTO vitalSigns = vitalSignsService.submitVitalSignsToDoctor(vitalSignsId);
            return ResponseEntity.ok(vitalSigns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error submitting vital signs: " + e.getMessage());
        }
    }
}
