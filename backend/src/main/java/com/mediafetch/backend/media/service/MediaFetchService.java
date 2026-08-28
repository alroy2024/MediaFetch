package com.mediafetch.backend.media.service;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.cache.annotation.Cacheable;

import com.mediafetch.backend.media.dto.GraphQlRequest;
import com.mediafetch.backend.media.dto.MediaList;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaFetchService {

    private final WebClient webClient;

    private static final String ANIME_QUERY = """
    query ($page: Int, $perPage: Int) {
        releasing : Page(page: $page, perPage: $perPage) {
            media(status: RELEASING, type: ANIME, sort: [POPULARITY_DESC]) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
        finished : Page(page: $page, perPage: $perPage) {
            media(status: NOT_YET_RELEASED, type: ANIME, sort: [POPULARITY_DESC]){
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
    }
""";

    private static final String MANGA_QUERY = """
    query ($page: Int, $perPage: Int) {
        releasing : Page(page: $page, perPage: $perPage) {
            media(status: RELEASING, type: MANGA, sort: [POPULARITY_DESC]) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
        finished : Page(page: $page, perPage: $perPage) {
            media(type: MANGA, sort: [POPULARITY_DESC]){
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
    }
""";

    @Cacheable(value = "media", key = "#type")
    public MediaList fetchMedia(String type) {
        String activeQuery = "MANGA".equalsIgnoreCase(type) ? MANGA_QUERY : ANIME_QUERY;
        Map<String, Object> variables = Map.of("page", 1, "perPage", 50);
        return webClient.post()
                .bodyValue(new GraphQlRequest(activeQuery, variables))
                .retrieve()
                .bodyToMono(MediaList.class)
                .block();
    }
}
