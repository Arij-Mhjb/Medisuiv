package com.medisuiv.patient.controller;

import com.medisuiv.patient.dto.PatientDTO;
import com.medisuiv.patient.dto.QuestionnaireDTO;
import com.medisuiv.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {
    private final PatientService patientService;

    /**
     * Register a new patient
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody PatientDTO patientDTO) {
        try {
            PatientDTO patient = patientService.registerPatient(
                    patientDTO.getEmail(), 
                    patientDTO.getFirstName(), 
                    patientDTO.getLastName(), 
                    patientDTO.getPhone());
            return ResponseEntity.status(HttpStatus.CREATED).body(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error registering patient: " + e.getMessage());
        }
    }

    /**
     * Complete patient questionnaire
     */
    @PostMapping("/{patientId}/questionnaire")
    public ResponseEntity<?> completeQuestionnaire(@PathVariable Long patientId,
                                                    @RequestBody QuestionnaireDTO questionnaireDTO) {
        try {
            QuestionnaireDTO questionnaire = patientService.completeQuestionnaire(
                    patientId, 
                    questionnaireDTO.getSpecialty(), 
                    questionnaireDTO.getSymptoms(), 
                    questionnaireDTO.getMedicalHistory(), 
                    questionnaireDTO.getCurrentMedications());
            return ResponseEntity.ok(questionnaire);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error completing questionnaire: " + e.getMessage());
        }
    }

    /**
     * Get patient by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        try {
            PatientDTO patient = patientService.getPatientById(id);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found");
        }
    }

    /**
     * Get patient by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getPatientByEmail(@PathVariable String email) {
        try {
            PatientDTO patient = patientService.getPatientByEmail(email);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found");
        }
    }

    /**
     * Get all pending patients
     */
    @GetMapping("/pending/all")
    public ResponseEntity<List<PatientDTO>> getPendingPatients() {
        List<PatientDTO> patients = patientService.getPendingPatients();
        return ResponseEntity.ok(patients);
    }

    /**
     * Get questionnaire by patient ID
     */
    @GetMapping("/{patientId}/questionnaire")
    public ResponseEntity<?> getQuestionnaireByPatientId(@PathVariable Long patientId) {
        try {
            QuestionnaireDTO questionnaire = patientService.getQuestionnaireByPatientId(patientId);
            if (questionnaire != null) {
                return ResponseEntity.ok(questionnaire);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Questionnaire not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching questionnaire");
        }
    }

    /**
     * Get questionnaires by specialty
     */
    @GetMapping("/questionnaires/specialty/{specialty}")
    public ResponseEntity<List<QuestionnaireDTO>> getQuestionnairesBySpecialty(@PathVariable String specialty) {
        List<QuestionnaireDTO> questionnaires = patientService.getQuestionnairesBySpecialty(specialty);
        return ResponseEntity.ok(questionnaires);
    }

    /**
     * Approve a patient
     */
    @GetMapping("/{patientId}/approve")
    public ResponseEntity<?> approvePatient(@PathVariable Long patientId,
                                            @RequestParam Long doctorId) {
        try {
            PatientDTO patient = patientService.approvePatient(patientId, doctorId);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error approving patient: " + e.getMessage());
        }
    }

    /**
     * Reject a patient
     */
    @PostMapping("/{patientId}/reject")
    public ResponseEntity<?> rejectPatient(@PathVariable Long patientId) {
        try {
            patientService.rejectPatient(patientId);
            return ResponseEntity.ok("Patient rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error rejecting patient: " + e.getMessage());
        }
    }

    /**
     * Get approved patients for a doctor
     */
    @GetMapping("/doctor/{doctorId}/approved")
    public ResponseEntity<List<PatientDTO>> getApprovedPatientsForDoctor(@PathVariable Long doctorId) {
        List<PatientDTO> patients = patientService.getApprovedPatientsForDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
}
