package com.mediafetch.backend.media.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cache.annotation.Cacheable;
import com.mediafetch.backend.media.dto.MediaListData;
import com.mediafetch.backend.media.dto.MediaResponse;
import com.mediafetch.backend.media.service.MediaFetchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MediaController {


    private final MediaFetchService mediaFetchService;
    @GetMapping("/fetch")
    @Cacheable("anime")
    public MediaListData fetch() {
        MediaResponse airing = mediaFetchService.getData("/top/anime","airing");
        MediaResponse air2 = mediaFetchService.getData("/top/anime","upcoming");
        return new MediaListData(airing,air2);
    }
}
    