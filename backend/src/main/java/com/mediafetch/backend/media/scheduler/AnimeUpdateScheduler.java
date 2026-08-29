package com.mediafetch.backend.media.scheduler;

import com.mediafetch.backend.media.model.Media;
import com.mediafetch.backend.media.repository.MediaRepository;
import com.mediafetch.backend.media.repository.UserMediaRepository;
import com.mediafetch.backend.media.dto.GraphQlRequest;
import com.mediafetch.backend.notification.service.NotificationService;
import com.mediafetch.backend.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AnimeUpdateScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AnimeUpdateScheduler.class);

    private final MediaRepository mediaRepository;
    private final UserMediaRepository userMediaRepository;
    private final NotificationService notificationService;
    private final WebClient webClient;

    private static final String ANILIST_API_URL = "https://graphql.anilist.co";

    private static final String query = """
            query ($id: Int) {
                Media(id: $id) {
                    episodes
                    status
                    nextAiringEpisode {
                        episode
                        airingAt
                    }
                }
            }
            """;

    @Scheduled(cron = "0 * * * * *") // Check every minute
    public void checkAiringAnime() {
        long currentUnixTime = System.currentTimeMillis() / 1000L;
        List<Media> airingMedia = mediaRepository.findByTypeAndNextAiringAtLessThanEqual("ANIME", currentUnixTime);

        if (airingMedia.isEmpty()) {
            return;
        }

        logger.info("Found {} anime with new episodes to notify.", airingMedia.size());

        for (Media media : airingMedia) {
            try {
                Integer episodeNum = media.getNextEpisode();
                if (episodeNum == null) {
                    episodeNum = 1;
                }

                String message = "Episode " + episodeNum + " of \"" + media.getTitle() + "\" has just aired!";
                
                // Find all users tracking this media
                List<User> users = userMediaRepository.findUsersByMediaId(media.getId());
                for (User user : users) {
                    boolean exists = notificationService.hasNotificationForMedia(user.getId(), media.getId());
                    if (!exists) {
                        notificationService.createMediaNotification(user, media, message);
                        logger.info("Created anime notification for user ID {} about \"{}\"", user.getId(), media.getTitle());
                    } else {
                        notificationService.updateMediaNotification(user.getId(), media.getId(), message);
                        logger.info("Updated anime notification for user ID {} about \"{}\"", user.getId(), media.getTitle());
                    }
                }

                // Now, fetch updated next airing info from AniList
                updateNextAiringInfo(media);

            } catch (Exception e) {
                logger.error("Error processing anime update for ID {}: {}", media.getId(), e.getMessage(), e);
            }
        }
    }

    private void updateNextAiringInfo(Media media) {
        try {
            Map<String, Object> variables = Map.of("id", media.getId());
            AniListMediaResponse response = webClient.post()
                    .uri(ANILIST_API_URL)
                    .bodyValue(new GraphQlRequest(query, variables))
                    .retrieve()
                    .bodyToMono(AniListMediaResponse.class)
                    .block();

            if (response != null && response.data() != null && response.data().Media() != null) {
                var aniMedia = response.data().Media();
                
                if (aniMedia.episodes() != null) {
                    media.setTotalChapter(aniMedia.episodes());
                }

                if (aniMedia.nextAiringEpisode() != null) {
                    media.setNextEpisode(aniMedia.nextAiringEpisode().episode());
                    media.setNextAiringAt(aniMedia.nextAiringEpisode().airingAt());
                } else {
                    media.setNextEpisode(null);
                    media.setNextAiringAt(null);
                }
                mediaRepository.save(media);
                logger.info("Updated next airing info for anime ID {} ({}): next episode = {}, next airing at = {}",
                        media.getId(), media.getTitle(), media.getNextEpisode(), media.getNextAiringAt());
            }
        } catch (Exception e) {
            logger.error("Error updating next airing info from AniList for anime ID {}: {}", media.getId(), e.getMessage(), e);
        }
    }

    public record AniListMediaResponse(PageData data) {
        public record PageData(AniMedia Media) {}
        public record AniMedia(Integer episodes, String status, NextAiringEpisode nextAiringEpisode) {}
        public record NextAiringEpisode(Integer episode, Long airingAt) {}
    }
}
