package com.mediafetch.backend.media.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.repository.UserRepository;
import com.mediafetch.backend.media.dto.AddDto;
import com.mediafetch.backend.media.dto.RemoveDto;
import com.mediafetch.backend.media.dto.UserMediaDto;
import com.mediafetch.backend.media.model.Media;
import com.mediafetch.backend.media.repository.MediaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaListService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    public List<UserMediaDto> mediaList(String username, String type) {
        validateType(type);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mediaRepository.findMediasByUserIdAndType(user.getId(), type).stream()
        .map(media -> new UserMediaDto(
                        media.getId(),
                        media.getTitle(),
                        media.getImage()))
                .toList();
    }

    @Transactional
    public void mediaAdd(AddDto request,String username) {
        // get request media id
        Integer mediaId;
            try {
                mediaId = Integer.parseInt(request.id());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid media ID format provided.");
            }
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // check request media already added by user
        validateType(request.type());
        if (mediaRepository.hasMedia(user.getId(), mediaId, request.type())) {
        throw new IllegalArgumentException("Media Already Added to your list");
        }
        // see if request media present in media table or else create it
        Media media = mediaRepository.findById(mediaId).orElseGet(() -> {
        String title = Objects.requireNonNullElse(request.english(), request.romaji());
        Media newMedia = new Media();
        newMedia.setId(mediaId);
        newMedia.setImage(request.image());
        newMedia.setTitle(title);
        newMedia.setType(request.type());
        return mediaRepository.save(newMedia);
        });
        // add media to user medias and save user
        user.getMedias().add(media);
        userRepository.save(user);
    }

    public void mediaRemove(RemoveDto request, String username) {
        Integer id = Integer.parseInt(request.id());
        // User user = userRepository.findByUsername(username)
        // .orElseThrow(() -> new IllegalArgumentException("User not found"));
        mediaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Media not found or already deleted"));
        // if (!media.getUser().getId().equals(user.getId())) {
        // throw new IllegalArgumentException("Unauthorized: You do not have permission
        // to delete this media");
        // }
        mediaRepository.deleteById(id);
    }

    private void validateType(String type) {
        if (!"ANIME".equals(type) && !"MANGA".equals(type)) {
            throw new IllegalArgumentException("Media type must be ANIME or MANGA");
        }
    }
}
