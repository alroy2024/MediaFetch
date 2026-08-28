package com.mediafetch.backend.novel.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.repository.UserRepository;
import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.model.Novel;
import com.mediafetch.backend.novel.repository.NovelRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
@Service
@RequiredArgsConstructor

public class NovelService {

    private final NovelRepository novelRepository;
    private final UserRepository userRepository;

    @Transactional
    public void novelAdd(NovelDto novelDto, String username){
        User user = getUser(username);
        Novel novel = novelRepository.findById(novelDto.id()).orElseGet(() ->
            novelRepository.save(new Novel(
                novelDto.id(),
                novelDto.title(),
                novelDto.image(),
                Math.max(0, novelDto.currentChapter() == null ? 0 : novelDto.currentChapter()),
                Math.max(0, novelDto.totalChapter() == null ? 0 : novelDto.totalChapter())
            ))
        );

        if (!user.getNovels().add(novel)) {
            throw new IllegalArgumentException("Novel already added to your list");
        }
        userRepository.save(user);
    }

    public List<NovelDto> novelFetch(String username){
        return getUser(username).getNovels().stream().map(
            novel -> new NovelDto(
                novel.getId(),
                novel.getTitle(),
                novel.getImage(),
                novel.getCurrentChapter(),
                novel.getTotalChapter()
            )).toList();
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
