package com.medisuiv.doctor.controller;

import com.medisuiv.doctor.dto.DoctorDTO;
import com.medisuiv.doctor.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {
    private final DoctorService doctorService;

    /**
     * Register a new doctor
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(@RequestBody DoctorDTO doctorDTO) {
        try {
            DoctorDTO doctor = doctorService.registerDoctor(
                    doctorDTO.getEmail(),
                    doctorDTO.getFirstName(),
                    doctorDTO.getLastName(),
                    doctorDTO.getPhone(),
                    doctorDTO.getSpecialty(),
                    doctorDTO.getLicenseNumber());
            return ResponseEntity.status(HttpStatus.CREATED).body(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error registering doctor: " + e.getMessage());
        }
    }

    /**
     * Get doctor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found");
        }
    }

    /**
     * Get doctor by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getDoctorByEmail(@PathVariable String email) {
        try {
            DoctorDTO doctor = doctorService.getDoctorByEmail(email);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found");
        }
    }

    /**
     * Get all doctors by specialty
     */
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get all verified doctors
     */
    @GetMapping("/verified/all")
    public ResponseEntity<List<DoctorDTO>> getAllVerifiedDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllVerifiedDoctors();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Verify a doctor
     */
    @PutMapping("/{doctorId}/verify")
    public ResponseEntity<?> verifyDoctor(@PathVariable Long doctorId) {
        try {
            DoctorDTO doctor = doctorService.verifyDoctor(doctorId);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error verifying doctor: " + e.getMessage());
        }
    }

    /**
     * Update doctor profile
     */
    @PutMapping("/{doctorId}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long doctorId, @RequestBody DoctorDTO doctorDTO) {
        try {
            DoctorDTO updatedDoctor = doctorService.updateDoctor(doctorId, doctorDTO);
            return ResponseEntity.ok(updatedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating doctor: " + e.getMessage());
        }
    }
}
