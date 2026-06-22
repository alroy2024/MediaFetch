package com.mediafetch.backend.auth.controller;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.dto.RegisterRequest;
import com.mediafetch.backend.auth.service.UserRegisterService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class Register {

    private final UserRegisterService userRegisterService;

    @PostMapping("/register")
    public User userRegistration(@RequestBody RegisterRequest request) {
        return userRegisterService.userRegistration(request);
    }
}