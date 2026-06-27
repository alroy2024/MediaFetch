package com.mediafetch.backend.media.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class MediaController {

    @GetMapping("/fetch")
    public ResponseEntity<?> fetch() {

        return ResponseEntity.ok("Hello");
    }
}
