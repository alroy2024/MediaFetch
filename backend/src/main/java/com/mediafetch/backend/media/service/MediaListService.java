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
import com.mediafetch.backend.media.model.UserMedia;
import com.mediafetch.backend.media.repository.MediaRepository;
import com.mediafetch.backend.media.repository.UserMediaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaListService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final UserMediaRepository userMediaRepository;

    public List<UserMediaDto> mediaList(String username, String type) {
        validateType(type);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userMediaRepository.findByUserIdAndMediaType(user.getId(), type).stream()
                .map(um -> new UserMediaDto(
                        um.getMedia().getId(),
                        um.getMedia().getTitle(),
                        um.getMedia().getImage(),
                        um.getStatus(),
                        um.getFavorite(),
                        um.getCurrentChapter(),
                        um.getMedia().getTotalChapter(),
                        um.getMedia().getDescription()))
                .toList();
    }

    @Transactional
    public void mediaAdd(AddDto request, String username) {
        Integer mediaId;
        try {
            mediaId = Integer.parseInt(request.id());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid media ID format provided.");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        validateType(request.type());
        if (userMediaRepository.existsByUserIdAndMediaIdAndType(user.getId(), mediaId, request.type())) {
            throw new IllegalArgumentException("Media Already Added to your list");
        }
        Media media = mediaRepository.findById(mediaId).orElseGet(() -> {
            String title = Objects.requireNonNullElse(request.english(), request.romaji());
            Media newMedia = new Media();
            newMedia.setId(mediaId);
            newMedia.setImage(request.image());
            newMedia.setTitle(title);
            newMedia.setType(request.type());
            newMedia.setTotalChapter(Math.max(0, request.totalChapter() == null ? 0 : request.totalChapter()));
            newMedia.setDescription(request.description());
            newMedia.setNextEpisode(request.nextEpisode());
            newMedia.setNextAiringAt(request.nextAiringAt());
            return mediaRepository.save(newMedia);
        });

        UserMedia userMedia = new UserMedia();
        userMedia.setUser(user);
        userMedia.setMedia(media);
        userMedia.setCurrentChapter(Math.max(0, request.currentChapter() == null ? 0 : request.currentChapter()));
        userMedia.setStatus(normalizeStatus(request.status(), request.type()));
        userMedia.setFavorite(Boolean.TRUE.equals(request.favorite()));
        userMediaRepository.save(userMedia);
    }

    @Transactional
    public void mediaRemove(RemoveDto request, String username) {
        Integer id = Integer.parseInt(request.id());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserMedia userMedia = userMediaRepository.findByUserIdAndMediaId(user.getId(), id)
                .orElseThrow(() -> new IllegalArgumentException("Media not found in your list"));
        userMediaRepository.delete(userMedia);
    }

    private void validateType(String type) {
        if (!"ANIME".equals(type) && !"MANGA".equals(type)) {
            throw new IllegalArgumentException("Media type must be ANIME or MANGA");
        }
    }

    private String normalizeStatus(String status, String type) {
        if (status == null || "WATCHED_READ".equals(status)) {
            return "ONGOING";
        }
        if ("WATCHED".equals(status) && "MANGA".equals(type)) {
            return "READ";
        }
        if ("READ".equals(status) && "ANIME".equals(type)) {
            return "WATCHED";
        }
        return status;
    }
}
