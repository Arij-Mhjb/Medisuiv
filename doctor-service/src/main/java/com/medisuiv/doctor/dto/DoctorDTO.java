package com.medisuiv.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String specialty;
    private String licenseNumber;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
