package com.mediafetch.backend.manga.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediafetch.backend.manga.dto.MangaList;
import com.mediafetch.backend.manga.service.MangaFetchService;

import lombok.RequiredArgsConstructor;
    
@RestController
@RequiredArgsConstructor
public class MangaController {

    private final MangaFetchService mangaFetchService;
    @GetMapping("/manga")
    public MangaList getManga() {
        return mangaFetchService.fetchManga();
    }
}
