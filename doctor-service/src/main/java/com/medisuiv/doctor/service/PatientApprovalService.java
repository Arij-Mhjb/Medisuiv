package com.medisuiv.doctor.service;

import com.medisuiv.doctor.dto.PatientApprovalDTO;
import com.medisuiv.doctor.model.PatientApproval;
import com.medisuiv.doctor.repository.PatientApprovalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientApprovalService {
    private final PatientApprovalRepository patientApprovalRepository;
    private final RestTemplate restTemplate;

    /**
     * Create a patient request for doctor approval
     */
    public PatientApprovalDTO createPatientApprovalRequest(Long patientId, String patientEmail, String patientFirstName,
                                                           String patientLastName, Long doctorId, String doctorEmail,
                                                           String specialty, String symptoms, String medicalHistory,
                                                           String currentMedications) {
        PatientApproval approval = new PatientApproval();
        approval.setPatientId(patientId);
        approval.setPatientEmail(patientEmail);
        approval.setPatientFirstName(patientFirstName);
        approval.setPatientLastName(patientLastName);
        approval.setDoctorId(doctorId);
        approval.setDoctorEmail(doctorEmail);
        approval.setSpecialty(specialty);
        approval.setSymptoms(symptoms);
        approval.setMedicalHistory(medicalHistory);
        approval.setCurrentMedications(currentMedications);
        approval.setStatus("PENDING");
        approval.setCreatedAt(LocalDateTime.now());

        PatientApproval savedApproval = patientApprovalRepository.save(approval);
        return mapToDTO(savedApproval);
    }

    public List<PatientApprovalDTO> getPendingApprovalsForDoctor(Long doctorId) {
        List<PatientApprovalDTO> result = new ArrayList<>();
        
        // Get approvals specifically assigned to this doctor
        result.addAll(patientApprovalRepository.findPendingApprovalsByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
                
        // Get unassigned approvals so demo doctors can see them
        result.addAll(patientApprovalRepository.findAll()
                .stream()
                .filter(pa -> "PENDING".equals(pa.getStatus()) && (pa.getDoctorId() == null || pa.getDoctorId() == 0))
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
                
        return result;
    }

    /**
     * Get pending approvals for a doctor (both assigned and unassigned by specialty)
     */
    public List<PatientApprovalDTO> getPendingApprovalsForDoctorWithSpecialty(Long doctorId, String specialty) {
        List<PatientApprovalDTO> result = new ArrayList<>();
        
        // Get approvals specifically assigned to this doctor
        result.addAll(patientApprovalRepository.findPendingApprovalsByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
        
        // Get unassigned approvals (doctorId = 0) for this specialty
        result.addAll(patientApprovalRepository.findPendingApprovalsBySpecialty(specialty)
                .stream()
                .filter(pa -> pa.getDoctorId() == null || pa.getDoctorId() == 0)
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
        
        return result;
    }

    /**
     * Get pending approvals by specialty (for doctors searching by specialty)
     */
    public List<PatientApprovalDTO> getPendingApprovalsBySpecialty(String specialty) {
        return patientApprovalRepository.findPendingApprovalsBySpecialty(specialty)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve a patient
     */
    public PatientApprovalDTO approvePatient(Long approvalId, Long doctorId, String notes) {
        PatientApproval approval = patientApprovalRepository.findById(approvalId)
                .orElseThrow(() -> new RuntimeException("Patient approval not found"));

        approval.setStatus("APPROVED");
        approval.setDoctorId(doctorId);
        approval.setApprovedAt(LocalDateTime.now());
        approval.setNotes(notes);

        PatientApproval savedApproval = patientApprovalRepository.save(approval);
        
        // Notify patient-service to update patient approval status
        try {
            String url = "http://patient-service:8081/api/patients/" + approval.getPatientId() + "/approve?doctorId=" + approval.getDoctorId();
            System.out.println("Calling patient-service to approve patient: " + url);
            restTemplate.getForObject(url, Object.class);
            System.out.println("Patient approval status updated in patient-service");
        } catch (Exception e) {
            System.err.println("Error updating patient approval status: " + e.getMessage());
            // Try localhost fallback
            try {
                String url = "http://localhost:8081/api/patients/" + approval.getPatientId() + "/approve?doctorId=" + approval.getDoctorId();
                restTemplate.getForObject(url, Object.class);
                System.out.println("Patient approval status updated via localhost");
            } catch (Exception e2) {
                System.err.println("Fallback also failed: " + e2.getMessage());
            }
        }
        
        return mapToDTO(savedApproval);
    }

    /**
     * Reject a patient
     */
    public PatientApprovalDTO rejectPatient(Long approvalId, String rejectReason) {
        PatientApproval approval = patientApprovalRepository.findById(approvalId)
                .orElseThrow(() -> new RuntimeException("Patient approval not found"));

        approval.setStatus("REJECTED");
        approval.setNotes(rejectReason);

        PatientApproval savedApproval = patientApprovalRepository.save(approval);
        
        // Notify patient-service to reject patient
        try {
            String url = "http://patient-service:8081/api/patients/" + approval.getPatientId() + "/reject";
            System.out.println("Calling patient-service to reject patient: " + url);
            restTemplate.postForObject(url, null, Object.class);
            System.out.println("Patient rejected in patient-service");
        } catch (Exception e) {
            System.err.println("Error rejecting patient: " + e.getMessage());
            // Try localhost fallback
            try {
                String url = "http://localhost:8081/api/patients/" + approval.getPatientId() + "/reject";
                restTemplate.postForObject(url, null, Object.class);
                System.out.println("Patient rejected via localhost");
            } catch (Exception e2) {
                System.err.println("Fallback also failed: " + e2.getMessage());
            }
        }
        
        return mapToDTO(savedApproval);
    }

    /**
     * Get approved patients for a doctor
     */
    public List<PatientApprovalDTO> getApprovedPatientsForDoctor(Long doctorId) {
        return patientApprovalRepository.findApprovedPatientsByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all approvals
     */
    public List<PatientApprovalDTO> getAllApprovals() {
        return patientApprovalRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper method
    private PatientApprovalDTO mapToDTO(PatientApproval approval) {
        PatientApprovalDTO dto = new PatientApprovalDTO();
        dto.setId(approval.getId());
        dto.setPatientId(approval.getPatientId());
        dto.setPatientEmail(approval.getPatientEmail());
        dto.setPatientFirstName(approval.getPatientFirstName());
        dto.setPatientLastName(approval.getPatientLastName());
        dto.setDoctorId(approval.getDoctorId());
        dto.setSpecialty(approval.getSpecialty());
        dto.setSymptoms(approval.getSymptoms());
        dto.setMedicalHistory(approval.getMedicalHistory());
        dto.setCurrentMedications(approval.getCurrentMedications());
        dto.setStatus(approval.getStatus());
        dto.setCreatedAt(approval.getCreatedAt());
        dto.setApprovedAt(approval.getApprovedAt());
        dto.setNotes(approval.getNotes());
        return dto;
    }
}
