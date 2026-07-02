package com.mediafetch.backend.manga.service;

import org.springframework.web.reactive.function.client.WebClient;

import com.mediafetch.backend.manga.dto.GraphQlRequest;
import com.mediafetch.backend.manga.dto.MangaList;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MangaFetchService {

    private final WebClient webClient;

    private static final String query = """
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(status: RELEASING, type: MANGA, sort: [POPULARITY_DESC]) {
                id
                title {
                    romaji
                }
                coverImage {
                    large
                }
            }
        }
    }
""";


    public MangaList fetchManga() {
        Map<String, Object> variables = Map.of("page", 1, "perPage", 50);
        return webClient.post()
                .bodyValue(new GraphQlRequest(query, variables))
                .retrieve()
                .bodyToMono(MangaList.class)
                .block();
    };
}
    
