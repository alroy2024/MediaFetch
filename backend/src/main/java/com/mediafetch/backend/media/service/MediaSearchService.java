package com.mediafetch.backend.media.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.mediafetch.backend.media.dto.GraphQlRequest;
import com.mediafetch.backend.media.dto.MediaSearchDto;
import com.mediafetch.backend.media.dto.SearchRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaSearchService {

    private final WebClient webClient;

    private static final String query = """
            query ($page: Int, $perPage: Int, $title: String, $type: MediaType) {
                Page(page: $page, perPage: $perPage) {
                media(search: $title, type: $type, sort: POPULARITY_DESC) {
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

    public MediaSearchDto mediaSearch(SearchRequestDto request) {
        Map<String, Object> variables = Map.of("page", 1, "perPage", 50, "title", request.searchQuery(),"type", "ANIME");
        return webClient.post()
        .bodyValue(new GraphQlRequest(query, variables))
        .retrieve()
        .bodyToMono(MediaSearchDto.class)
        .block();
    }
}