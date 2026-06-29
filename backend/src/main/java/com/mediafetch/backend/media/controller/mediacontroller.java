package com.mediafetch.backend.media.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediafetch.backend.media.dto.MediaListData;
import com.mediafetch.backend.media.dto.MediaResponse;
import com.mediafetch.backend.media.service.MediaFetchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MediaController {

    private final MediaFetchService mediaFetchService;
    @GetMapping("/fetch")
    public MediaListData fetch() {
        MediaResponse airing = mediaFetchService.getData("/top/anime","airing");
        MediaResponse air2 = mediaFetchService.getData("/top/anime","upcoming");
        try {
            // Pause the current thread for 2000 milliseconds (2 seconds)
            Thread.sleep(2000); 
        } catch (InterruptedException e) {
            System.out.println("The sleep was interrupted!");
        }

        MediaResponse air3 = mediaFetchService.getData("/top/anime","bypopularity");

        return new MediaListData(airing,air2,air3);
    }
}
