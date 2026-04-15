package com.medisuiv.patient.service;

import com.medisuiv.patient.dto.VitalSignsDTO;
import com.medisuiv.patient.model.VitalSigns;
import com.medisuiv.patient.repository.VitalSignsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VitalSignsService {
    private final VitalSignsRepository vitalSignsRepository;

    /**
     * Record new vital signs for patient
     */
    public VitalSignsDTO recordVitalSigns(Long patientId, Integer bloodPressureSystolic, Integer bloodPressureDiastolic,
                                          Integer heartRate, Double temperature, Integer respiratoryRate,
                                          Double weight, Double height, String notes) {
        VitalSigns vitalSigns = new VitalSigns();
        vitalSigns.setPatientId(patientId);
        vitalSigns.setBloodPressureSystolic(bloodPressureSystolic);
        vitalSigns.setBloodPressureDiastolic(bloodPressureDiastolic);
        vitalSigns.setHeartRate(heartRate);
        vitalSigns.setTemperature(temperature);
        vitalSigns.setRespiratoryRate(respiratoryRate);
        vitalSigns.setWeight(weight);
        vitalSigns.setHeight(height);
        vitalSigns.setNotes(notes);
        vitalSigns.setRecordedAt(LocalDateTime.now());
        vitalSigns.setSubmittedToDoctor(false);

        VitalSigns saved = vitalSignsRepository.save(vitalSigns);
        return mapToDTO(saved);
    }

    /**
     * Get all vital signs records for a patient
     */
    public List<VitalSignsDTO> getVitalSignsByPatientId(Long patientId) {
        return vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get latest vital signs for patient
     */
    public VitalSignsDTO getLatestVitalSigns(Long patientId) {
        List<VitalSigns> records = vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
        return records.isEmpty() ? null : mapToDTO(records.get(0));
    }

    /**
     * Submit vital signs to doctor
     */
    public VitalSignsDTO submitVitalSignsToDoctor(Long vitalSignsId) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(vitalSignsId)
                .orElseThrow(() -> new RuntimeException("Vital signs record not found"));

        vitalSigns.setSubmittedToDoctor(true);
        vitalSigns.setSubmittedAt(LocalDateTime.now());

        VitalSigns saved = vitalSignsRepository.save(vitalSigns);
        return mapToDTO(saved);
    }

    // Helper method
    private VitalSignsDTO mapToDTO(VitalSigns vitalSigns) {
        VitalSignsDTO dto = new VitalSignsDTO();
        dto.setId(vitalSigns.getId());
        dto.setPatientId(vitalSigns.getPatientId());
        dto.setBloodPressureSystolic(vitalSigns.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(vitalSigns.getBloodPressureDiastolic());
        dto.setHeartRate(vitalSigns.getHeartRate());
        dto.setTemperature(vitalSigns.getTemperature());
        dto.setRespiratoryRate(vitalSigns.getRespiratoryRate());
        dto.setWeight(vitalSigns.getWeight());
        dto.setHeight(vitalSigns.getHeight());
        dto.setNotes(vitalSigns.getNotes());
        dto.setRecordedAt(vitalSigns.getRecordedAt());
        dto.setSubmittedToDoctor(vitalSigns.getSubmittedToDoctor());
        return dto;
    }
}
