package com.mediafetch.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

public record RegisterRequest(
    @NotBlank(message = "Gmail is required") @Email(message = "Invalid Email Format") 
    String email,
    
    @NotBlank(message = "Username is required") @Size(min = 2, max = 30, message = "Username must be between 2 and 30 characters")
    String username,

    @NotBlank(message = "Password is required") @Size(min = 2, max = 72, message = "Password must be between 2 and 72 characters") 
    String password
) {
}