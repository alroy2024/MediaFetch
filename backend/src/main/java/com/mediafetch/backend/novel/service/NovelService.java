package com.mediafetch.backend.novel.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.model.Novel;
import com.mediafetch.backend.novel.repository.NovelRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
@Service
@RequiredArgsConstructor

public class NovelService {

    private final NovelRepository novelRepository;

    public void novelAdd(NovelDto novelDto){
        Novel novel = new Novel(novelDto.id(),novelDto.title(),novelDto.image());
        novelRepository.save(novel);
    }

    public List<NovelDto> novelFetch(){
        return novelRepository.findAll().stream().map(
            novel -> new NovelDto(
                novel.getId(),
                novel.getTitle(),
                novel.getImage()
            )).toList();
    }
}
