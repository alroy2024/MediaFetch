package com.mediafetch.backend.media.service;

import org.springframework.web.reactive.function.client.WebClient;

import com.mediafetch.backend.media.dto.GraphQlRequest;
import com.mediafetch.backend.media.dto.MediaList;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaFetchService{

    private final WebClient webClient;

    private static final String query = """
    query ($page: Int, $perPage: Int, $type: MediaType) {
        releasing : Page(page: $page, perPage: $perPage) {
            media(status: RELEASING, type: $type, sort: [POPULARITY_DESC]) {
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
            media(status: FINISHED, type: $type, sort: [POPULARITY_DESC]){
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

    public MediaList fetchMedia(String type) {
        Map<String, Object> variables = Map.of("page", 1, "perPage", 50, "type", type);
        return webClient.post()
                .bodyValue(new GraphQlRequest(query, variables))
                .retrieve()
                .bodyToMono(MediaList.class)
                .block();
    };
}
    
