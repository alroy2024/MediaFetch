package com.mediafetch.backend.media.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediafetch.backend.media.dto.MediaList;
import com.mediafetch.backend.media.service.MediaFetchService;

import lombok.RequiredArgsConstructor;
    
@RestController
@RequiredArgsConstructor
public class MediaController {

    private final MediaFetchService mediaFetchService;
    
    @GetMapping("/manga")
    @Cacheable("Manga")
    public MediaList getManga() {
        return mediaFetchService.fetchMedia("MANGA");
    }

    @GetMapping("/anime")
    @Cacheable("Anime")
    public MediaList getAnime() {
        return mediaFetchService.fetchMedia("ANIME");
    }
}
