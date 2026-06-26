package com.mediafetch.backend.auth.controller;

import com.mediafetch.backend.auth.dto.RegisterRequest;
import com.mediafetch.backend.auth.service.UserRegisterService;

import jakarta.validation.Valid;

import com.mediafetch.backend.auth.service.UserLoginService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import com.mediafetch.backend.auth.dto.AuthResponse;
import com.mediafetch.backend.auth.dto.LoginRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRegisterService userRegisterService;
    private final UserLoginService userLoginService;

    @PostMapping("/register")
    public ResponseEntity<?> userRegistration(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userRegisterService.userRegistration(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userLoginService.userLogin(request);
        return ResponseEntity.ok(response);
    }
    
}