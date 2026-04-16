package com.medisuiv.doctor.controller;

import com.medisuiv.doctor.dto.PatientApprovalDTO;
import com.medisuiv.doctor.service.PatientApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient-approvals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientApprovalController {
    private final PatientApprovalService approvalService;

    /**
     * Create a patient approval request
     */
    @PostMapping("/create")
    public ResponseEntity<?> createApprovalRequest(@RequestBody Map<String, Object> request) {
        try {
            PatientApprovalDTO approval = approvalService.createPatientApprovalRequest(
                    Long.valueOf(request.get("patientId").toString()),
                    (String) request.get("patientEmail"),
                    (String) request.get("patientFirstName"),
                    (String) request.get("patientLastName"),
                    Long.valueOf(request.get("doctorId").toString()),
                    (String) request.get("doctorEmail"),
                    (String) request.get("specialty"),
                    (String) request.get("symptoms"),
                    (String) request.get("medicalHistory"),
                    (String) request.get("currentMedications"));
            return ResponseEntity.status(HttpStatus.CREATED).body(approval);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating approval request: " + e.getMessage());
        }
    }

    /**
     * Get pending approvals for a doctor
     */
    @GetMapping("/doctor/{doctorId}/pending")
    public ResponseEntity<List<PatientApprovalDTO>> getPendingApprovalsForDoctor(@PathVariable Long doctorId) {
        List<PatientApprovalDTO> approvals = approvalService.getPendingApprovalsForDoctor(doctorId);
        return ResponseEntity.ok(approvals);
    }

    /**
     * Get pending approvals for a doctor with their specialty
     */
    @GetMapping("/doctor/{doctorId}/specialty/{specialty}/pending")
    public ResponseEntity<List<PatientApprovalDTO>> getPendingApprovalsForDoctorWithSpecialty(
            @PathVariable Long doctorId, 
            @PathVariable String specialty) {
        List<PatientApprovalDTO> approvals = approvalService.getPendingApprovalsForDoctorWithSpecialty(doctorId, specialty);
        return ResponseEntity.ok(approvals);
    }

    /**
     * Get pending approvals by specialty
     */
    @GetMapping("/specialty/{specialty}/pending")
    public ResponseEntity<List<PatientApprovalDTO>> getPendingApprovalsBySpecialty(@PathVariable String specialty) {
        List<PatientApprovalDTO> approvals = approvalService.getPendingApprovalsBySpecialty(specialty);
        return ResponseEntity.ok(approvals);
    }

    /**
     * Approve a patient
     */
    @PutMapping("/{approvalId}/approve")
    public ResponseEntity<?> approvePatient(@PathVariable Long approvalId,
                                            @RequestParam Long doctorId,
                                            @RequestParam(required = false) String notes) {
        try {
            PatientApprovalDTO approval = approvalService.approvePatient(approvalId, doctorId, notes);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error approving patient: " + e.getMessage());
        }
    }

    /**
     * Reject a patient
     */
    @PutMapping("/{approvalId}/reject")
    public ResponseEntity<?> rejectPatient(@PathVariable Long approvalId,
                                           @RequestParam(required = false) String rejectReason) {
        try {
            PatientApprovalDTO approval = approvalService.rejectPatient(approvalId, rejectReason);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error rejecting patient: " + e.getMessage());
        }
    }

    /**
     * Get approved patients for a doctor
     */
    @GetMapping("/doctor/{doctorId}/approved")
    public ResponseEntity<List<PatientApprovalDTO>> getApprovedPatients(@PathVariable Long doctorId) {
        List<PatientApprovalDTO> approvals = approvalService.getApprovedPatientsForDoctor(doctorId);
        return ResponseEntity.ok(approvals);
    }
}
