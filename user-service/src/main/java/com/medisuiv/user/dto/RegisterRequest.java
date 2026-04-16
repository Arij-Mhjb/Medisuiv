package com.medisuiv.user.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    /** "PATIENT" or "DOCTOR" */
    private String role;
    /** Required when role = DOCTOR */
    private String specialty;
}
