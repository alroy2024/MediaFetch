package com.mediafetch.backend.media.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.media.model.Media;
// import com.mediafetch.backend.auth.model.User;
// import com.mediafetch.backend.auth.repository.UserRepository;
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
    // private final UserRepository userRepository;

    public List<UserMediaDto> mediaList(String username){
        //  User user = userRepository.findByUsername(username)
        //     .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mediaRepository.findAll().stream()
        // findByUserId(user.getId()).stream()
        .map(media -> new UserMediaDto(
            media.getId(),
            media.getTitle(),
            media.getImage()
        )).toList();
    }

    public void mediaAdd(AddDto request,String username) {
        // Integer id = Integer.parseInt(request.id());
        // User user = userRepository.findByUsername(username)
        //     .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Integer id = Integer.parseInt(request.id());
        if (mediaRepository.existsById(id)) {
            throw new IllegalArgumentException("Media Already Added");
        }
        String title = Objects.requireNonNullElse(request.english(), request.romaji());
        Media media = new Media(id,title, request.image());
        mediaRepository.save(media);
    }

    public void mediaRemove(RemoveDto request,String username){
        Integer id = Integer.parseInt(request.id());
        // User user = userRepository.findByUsername(username)
        //     .orElseThrow(() -> new IllegalArgumentException("User not found"));
        mediaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Media not found or already deleted"));
        // if (!media.getUser().getId().equals(user.getId())) {
        //     throw new IllegalArgumentException("Unauthorized: You do not have permission to delete this media");
        // }
        mediaRepository.deleteById(id);
    }
}
