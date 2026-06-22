package com.mediafetch.backend.media.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class mediacontroller {

    @GetMapping("/fetch")
    public ResponseEntity<?> fetch() {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> Response = restTemplate
                .getForObject("https://api.jikan.moe/v4/top/anime?filter=airing&limit=5", Map.class);
        Object data = Response.get("data");
        return ResponseEntity.ok(data);
    }
}
