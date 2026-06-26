package com.mediafetch.backend.auth.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.mediafetch.backend.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.mediafetch.backend.auth.dto.AuthResponse;
import com.mediafetch.backend.auth.dto.LoginRequest;
import com.mediafetch.backend.auth.model.User;
import java.util.Optional;

@Service    
@RequiredArgsConstructor
public class UserLoginService {
    
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final JwtService jwtService;

    public AuthResponse userLogin(LoginRequest request){

        Optional<User> userOptional = userRepository.findByUsername(request.username());

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (!passwordEncoder.matches(request.password(), userOptional.get().getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        User user = userOptional.get();
        String token = jwtService.generateToken(user);
        return new AuthResponse(token,user.getUsername(),user.getEmail());
    }
}
