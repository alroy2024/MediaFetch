package com.mediafetch.backend.media.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.media.model.Media;
import com.mediafetch.backend.media.dto.AddDto;
import com.mediafetch.backend.media.dto.RemoveDto;
import com.mediafetch.backend.media.dto.UserMediaDto;
import com.mediafetch.backend.media.repository.MediaRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MediaListService {

    private final MediaRepository mediaRepository;

    public List<UserMediaDto> mediaList(){
        return mediaRepository.findAll().stream()
        .map(media -> new UserMediaDto(
            media.getId(),
            media.getTitle(),
            media.getImage()
        )).toList();
    }

    public void mediaAdd(AddDto request) {
        Integer id = Integer.parseInt(request.id());
        if (mediaRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Media Already Added");
        }
        String title = Objects.requireNonNullElse(request.english(), request.romaji());
        Media media = new Media(id, title, request.image());
        mediaRepository.save(media);
    }

    public void mediaRemove(RemoveDto request){
        Integer id = Integer.parseInt(request.id());
        if (!mediaRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Media Already Deleted");
        }
        mediaRepository.deleteById(id);
    }
}
