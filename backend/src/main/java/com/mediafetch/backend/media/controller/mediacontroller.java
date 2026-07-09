package com.mediafetch.backend.media.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mediafetch.backend.media.dto.AddDto;
import com.mediafetch.backend.media.dto.MediaList;
import com.mediafetch.backend.media.dto.MediaSearchDto;
import com.mediafetch.backend.media.dto.RemoveDto;
import com.mediafetch.backend.media.dto.RequestDto;
import com.mediafetch.backend.media.dto.UserMediaDto;
import com.mediafetch.backend.media.service.*;

import java.util.List;
import lombok.RequiredArgsConstructor;
    
@RestController
@RequiredArgsConstructor
public class MediaController {

    private final MediaFetchService mediaFetchService;
    private final MediaSearchService mediaSearchService;
    private final MediaListService mediaListService;

    
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

    @PostMapping("/search")
    public MediaSearchDto fetch(@RequestBody RequestDto request){
        return mediaSearchService.mediaSearch(request);
    }

    @PostMapping("/add")
    public void add(@RequestBody AddDto request){
        mediaListService.mediaAdd(request);
    }

    @PostMapping("/remove")
    public void remove(@RequestBody RemoveDto request){
        mediaListService.mediaRemove(request);
    }

    @GetMapping("/mylist")
    public List<UserMediaDto> mylist(){
        return mediaListService.mediaList();
    }
}
