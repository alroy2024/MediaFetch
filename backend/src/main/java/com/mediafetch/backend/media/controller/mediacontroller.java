package com.mediafetch.backend.media.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
public class Mediacontroller {

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
    public MediaSearchDto fetch(@RequestBody RequestDto request) {
        return mediaSearchService.mediaSearch(request);
    }

    @PostMapping("/add")
    public void add(@RequestBody AddDto request, @AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername();
        mediaListService.mediaAdd(request, username);
    }

    @PostMapping("/remove")
    public void remove(@RequestBody RemoveDto request, @AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername();
        mediaListService.mediaRemove(request, username);
    }

    @GetMapping("/mylist")
    public List<UserMediaDto> mylist(@RequestParam String type, @AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername();
        return mediaListService.mediaList(username, type.toUpperCase());
    }
}
