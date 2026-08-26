package com.mediafetch.backend.novel.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import com.mediafetch.backend.novel.dto.RequestDto;
import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.service.NovelService;
import com.mediafetch.backend.novel.service.NovelFetchService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/novels")
public class NovelController {

    final private NovelFetchService novelFetchService;
    final private NovelService novelService;

    @GetMapping
    public List<NovelDto> novelList(@AuthenticationPrincipal UserDetails currentUser) {
        return novelService.novelFetch(currentUser.getUsername());
    }

    @PostMapping
    public void novelAdd(@RequestBody NovelDto novelDto,
                         @AuthenticationPrincipal UserDetails currentUser) {
        novelService.novelAdd(novelDto, currentUser.getUsername());
    }

    @PostMapping("searchNovel")
    public List<NovelDto> novelSearch(@RequestBody RequestDto requestDto) {
        return novelFetchService.getName(requestDto);
    }

    @GetMapping("topNovel")
    public List<NovelDto> topNovel(){
        return novelFetchService.getTopNovelDtos();
    }
}
