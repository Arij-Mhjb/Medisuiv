package com.medisuiv.doctor.service;

import com.medisuiv.doctor.dto.DoctorDTO;
import com.medisuiv.doctor.model.Doctor;
import com.medisuiv.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;

    /**
     * Register a new doctor
     */
    public DoctorDTO registerDoctor(String email, String firstName, String lastName, String phone,
                                   String specialty, String licenseNumber) {
        Doctor doctor = new Doctor();
        doctor.setEmail(email);
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setPhone(phone);
        doctor.setSpecialty(specialty);
        doctor.setLicenseNumber(licenseNumber);
        doctor.setIsVerified(false);
        doctor.setCreatedAt(LocalDateTime.now());

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    /**
     * Get doctor by ID
     */
    public DoctorDTO getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    /**
     * Get doctor by email
     */
    public DoctorDTO getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    /**
     * Get all doctors by specialty
     */
    public List<DoctorDTO> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findBySpecialty(specialty)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all verified doctors
     */
    public List<DoctorDTO> getAllVerifiedDoctors() {
        return doctorRepository.findByIsVerifiedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Verify doctor account
     */
    public DoctorDTO verifyDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setIsVerified(true);
        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    /**
     * Update doctor profile
     */
    public DoctorDTO updateDoctor(Long doctorId, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctorDTO.getFirstName() != null) {
            doctor.setFirstName(doctorDTO.getFirstName());
        }
        if (doctorDTO.getLastName() != null) {
            doctor.setLastName(doctorDTO.getLastName());
        }
        if (doctorDTO.getPhone() != null) {
            doctor.setPhone(doctorDTO.getPhone());
        }
        if (doctorDTO.getSpecialty() != null) {
            doctor.setSpecialty(doctorDTO.getSpecialty());
        }

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }
    private DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setEmail(doctor.getEmail());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setPhone(doctor.getPhone());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setIsVerified(doctor.getIsVerified());
        dto.setCreatedAt(doctor.getCreatedAt());
        return dto;
    }
}
