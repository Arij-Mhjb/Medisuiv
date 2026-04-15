package com.medisuiv.doctor.repository;

import com.medisuiv.doctor.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);

    List<Doctor> findBySpecialty(String specialty);

    List<Doctor> findByIsVerifiedTrue();
}
