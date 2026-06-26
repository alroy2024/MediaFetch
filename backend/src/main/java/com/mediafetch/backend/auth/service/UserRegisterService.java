package com.mediafetch.backend.auth.service;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.repository.UserRepository;
import com.mediafetch.backend.auth.dto.RegisterRequest;
import com.mediafetch.backend.auth.dto.AuthResponse;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserRegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse userRegistration(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        
        String token = jwtService.generateToken(user);

        return new AuthResponse(token,user.getUsername(),user.getEmail());
    }

}
