package com.mediafetch.backend.media.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.media.dto.AddDto;
import com.mediafetch.backend.media.repository.MediaRepository;
import com.mediafetch.backend.media.model.Media;

import lombok.RequiredArgsConstructor;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MediaAddService {

    private final MediaRepository mediaRepository;

    public void mediaAdd(AddDto request) {
        Integer id = Integer.parseInt(request.id());
        if (mediaRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        String title = Objects.requireNonNullElse(request.english(), request.romaji());
        Media media = new Media(id, title, request.image());
        mediaRepository.save(media);
    }
}
