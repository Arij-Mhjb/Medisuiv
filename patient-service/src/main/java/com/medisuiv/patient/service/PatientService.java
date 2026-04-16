package com.medisuiv.patient.service;

import com.medisuiv.patient.dto.PatientDTO;
import com.medisuiv.patient.dto.QuestionnaireDTO;
import com.medisuiv.patient.model.Patient;
import com.medisuiv.patient.model.Questionnaire;
import com.medisuiv.patient.repository.PatientRepository;
import com.medisuiv.patient.repository.QuestionnaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final RestTemplate restTemplate;

    /**
     * Register a new patient
     */
    public PatientDTO registerPatient(String email, String firstName, String lastName, String phone) {
        Optional<Patient> existingPatient = patientRepository.findByEmail(email);
        if (existingPatient.isPresent()) {
            Patient p = existingPatient.get();
            p.setFirstName(firstName);
            p.setLastName(lastName);
            p.setPhone(phone);
            patientRepository.save(p);
            return mapToDTO(p);
        }

        Patient patient = new Patient();
        patient.setEmail(email);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setPhone(phone);
        patient.setCreatedAt(LocalDateTime.now());
        patient.setIsApproved(false);

        Patient savedPatient = patientRepository.save(patient);
        return mapToDTO(savedPatient);
    }

    /**
     * Complete patient questionnaire
     */
    public QuestionnaireDTO completeQuestionnaire(Long patientId, String specialty, String symptoms, 
                                                   String medicalHistory, String currentMedications) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Questionnaire questionnaire = patient.getQuestionnaire();
        if (questionnaire == null) {
            questionnaire = new Questionnaire();
            questionnaire.setPatient(patient);
        }
        
        questionnaire.setSpecialty(specialty);
        questionnaire.setSymptoms(symptoms);
        questionnaire.setMedicalHistory(medicalHistory);
        questionnaire.setCurrentMedications(currentMedications);
        questionnaire.setCompletedAt(LocalDateTime.now());
        questionnaire.setIsVisibleToDoctors(true);

        Questionnaire savedQuestionnaire = questionnaireRepository.save(questionnaire);
        patient.setQuestionnaire(questionnaire);
        
        // Reset approval if re-submitting
        patient.setIsApproved(false);
        patient.setAssignedDoctorId(null);
        patient.setApprovedByDoctorId(null);
        patientRepository.save(patient);

        // Create approval request asynchronously in background thread - don't block response
        Thread approvalThread = new Thread(() -> {
            try {
                System.out.println("Creating approval request asynchronously for patient " + patientId);
                createApprovalRequestBySpecialty(patientId, patient, specialty, symptoms, medicalHistory, currentMedications);
                System.out.println("Approval request created successfully");
            } catch (Exception e) {
                System.err.println("Background thread - Error creating approval request: " + e.getMessage());
                e.printStackTrace();
            }
        });
        approvalThread.setDaemon(true);
        approvalThread.start();

        return mapQuestionnaireToDTO(savedQuestionnaire);
    }

    /**
     * Create a generic approval request by specialty
     */
    private void createApprovalRequestBySpecialty(Long patientId, Patient patient, String specialty,
                                                  String symptoms, String medicalHistory, String currentMedications) {
        try {
            // Wait a bit to ensure doctor service is ready
            Thread.sleep(1000);
            
            Map<String, Object> approvalRequest = new HashMap<>();
            approvalRequest.put("patientId", patientId);
            approvalRequest.put("patientEmail", patient.getEmail());
            approvalRequest.put("patientFirstName", patient.getFirstName());
            approvalRequest.put("patientLastName", patient.getLastName());
            approvalRequest.put("doctorId", 0L);
            approvalRequest.put("doctorEmail", "");
            approvalRequest.put("specialty", specialty);
            approvalRequest.put("symptoms", symptoms);
            approvalRequest.put("medicalHistory", medicalHistory);
            approvalRequest.put("currentMedications", currentMedications);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(approvalRequest, headers);

            String url = "http://doctor-service:8082/api/patient-approvals/create";
            System.out.println("Attempting to create approval request at: " + url);
            
            Object response = restTemplate.postForObject(url, entity, Object.class);
            System.out.println("Approval request created successfully: " + response);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            System.err.println("Approval request thread interrupted");
        } catch (Exception e) {
            System.err.println("Error creating approval request: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            // Try localhost as fallback
            try {
                System.out.println("Trying localhost fallback...");
                Map<String, Object> approvalRequest = new HashMap<>();
                approvalRequest.put("patientId", patientId);
                approvalRequest.put("patientEmail", patient.getEmail());
                approvalRequest.put("patientFirstName", patient.getFirstName());
                approvalRequest.put("patientLastName", patient.getLastName());
                approvalRequest.put("doctorId", 0L);
                approvalRequest.put("doctorEmail", "");
                approvalRequest.put("specialty", specialty);
                approvalRequest.put("symptoms", symptoms);
                approvalRequest.put("medicalHistory", medicalHistory);
                approvalRequest.put("currentMedications", currentMedications);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(approvalRequest, headers);

                String url = "http://localhost:8082/api/patient-approvals/create";
                Object response = restTemplate.postForObject(url, entity, Object.class);
                System.out.println("Approval request created via localhost: " + response);
            } catch (Exception e2) {
                System.err.println("Fallback also failed: " + e2.getMessage());
            }
        }
    }

    /**
     * Get patient by ID
     */
    public PatientDTO getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    /**
     * Get patient by email
     */
    public PatientDTO getPatientByEmail(String email) {
        return patientRepository.findByEmail(email)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    /**
     * Get all pending (unapproved) patients
     */
    public List<PatientDTO> getPendingPatients() {
        return patientRepository.findAllPendingPatients()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get questionnaire by patient ID
     */
    public QuestionnaireDTO getQuestionnaireByPatientId(Long patientId) {
        return questionnaireRepository.findByPatientId(patientId)
                .map(this::mapQuestionnaireToDTO)
                .orElse(null);
    }

    /**
     * Get all questionnaires by specialty
     */
    public List<QuestionnaireDTO> getQuestionnairesBySpecialty(String specialty) {
        return questionnaireRepository.findBySpecialty(specialty)
                .stream()
                .map(this::mapQuestionnaireToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve patient by doctor
     */
    public PatientDTO approvePatient(Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setIsApproved(true);
        patient.setApprovedByDoctorId(doctorId);
        patient.setAssignedDoctorId(doctorId);
        patient.setApprovedAt(LocalDateTime.now());

        Patient savedPatient = patientRepository.save(patient);
        return mapToDTO(savedPatient);
    }

    /**
     * Reject patient
     */
    public void rejectPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patientRepository.delete(patient);
    }

    /**
     * Get approved patients for a doctor
     */
    public List<PatientDTO> getApprovedPatientsForDoctor(Long doctorId) {
        return patientRepository.findApprovedPatientsByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods
    private PatientDTO mapToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setEmail(patient.getEmail());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setPhone(patient.getPhone());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setIsApproved(patient.getIsApproved());
        dto.setAssignedDoctorId(patient.getAssignedDoctorId());
        dto.setApprovedAt(patient.getApprovedAt());
        
        if (patient.getQuestionnaire() != null) {
            dto.setQuestionnaire(mapQuestionnaireToDTO(patient.getQuestionnaire()));
        }
        return dto;
    }

    private QuestionnaireDTO mapQuestionnaireToDTO(Questionnaire questionnaire) {
        QuestionnaireDTO dto = new QuestionnaireDTO();
        dto.setId(questionnaire.getId());
        dto.setPatientId(questionnaire.getPatient().getId());
        dto.setSpecialty(questionnaire.getSpecialty());
        dto.setSymptoms(questionnaire.getSymptoms());
        dto.setMedicalHistory(questionnaire.getMedicalHistory());
        dto.setCurrentMedications(questionnaire.getCurrentMedications());
        dto.setCompletedAt(questionnaire.getCompletedAt());
        return dto;
    }
}
