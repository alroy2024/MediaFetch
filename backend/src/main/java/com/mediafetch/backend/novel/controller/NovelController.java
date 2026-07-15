package com.mediafetch.backend.novel.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.mediafetch.backend.novel.dto.RequestDto;
import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.service.NovelService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class NovelController {

    final private NovelService novelService;

    @PostMapping("/searchNovel")
    public List<NovelDto> novelSearch(@RequestBody RequestDto requestDto){
        return novelService.getNames(requestDto);
    }
    
}
