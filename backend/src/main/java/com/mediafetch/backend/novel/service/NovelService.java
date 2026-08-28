package com.mediafetch.backend.novel.service;

import org.springframework.stereotype.Service;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.repository.UserRepository;
import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.model.Novel;
import com.mediafetch.backend.novel.model.UserNovel;
import com.mediafetch.backend.novel.repository.NovelRepository;
import com.mediafetch.backend.novel.repository.UserNovelRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NovelService {

    private final NovelRepository novelRepository;
    private final UserRepository userRepository;
    private final NovelFetchService novelFetchService;
    private final UserNovelRepository userNovelRepository;

    @Transactional
    public void novelAdd(NovelDto novelDto, String username){
        User user = getUser(username);
        if (userNovelRepository.existsByUserIdAndNovelId(user.getId(), novelDto.id())) {
            throw new IllegalArgumentException("Novel already added to your list");
        }

        Novel novel = novelRepository.findById(novelDto.id()).orElseGet(() -> {
            Novel newNovel = new Novel();
            newNovel.setId(novelDto.id());
            newNovel.setTitle(novelDto.title());
            newNovel.setImage(novelDto.image());
            newNovel.setUrl(novelDto.url());
            newNovel.setDescription(novelDto.description());
            newNovel.setTotalChapter(Math.max(0, novelDto.totalChapter() == null ? 0 : novelDto.totalChapter()));

            int latestChapter = novelFetchService.fetchCurrentChapter(newNovel.getUrl());
            newNovel.setTotalChapter(latestChapter);
            return novelRepository.save(newNovel);
        });

        UserNovel userNovel = new UserNovel();
        userNovel.setUser(user);
        userNovel.setNovel(novel);
        
        int currentProgress = Math.max(0, novelDto.currentChapter() == null ? 0 : novelDto.currentChapter());
        if (novel.getTotalChapter() > 0) {
            currentProgress = Math.min(currentProgress, novel.getTotalChapter());
        }
        userNovel.setCurrentChapter(currentProgress);
        userNovel.setStatus(normalizeStatus(novelDto.status()));
        userNovel.setFavorite(Boolean.TRUE.equals(novelDto.favorite()));
        userNovelRepository.save(userNovel);
    }

    public List<NovelDto> novelFetch(String username){
        User user = getUser(username);
        return userNovelRepository.findByUserId(user.getId()).stream().map(
            un -> new NovelDto(
                un.getNovel().getId(),
                un.getNovel().getTitle(),
                un.getNovel().getImage(),
                un.getNovel().getUrl(),
                un.getNovel().getDescription(),
                un.getCurrentChapter(),
                un.getNovel().getTotalChapter(),
                un.getStatus(),
                un.getFavorite()
            )).toList();
    }

    @Transactional
    public void novelRemove(Long novelId, String username) {
        User user = getUser(username);
        UserNovel userNovel = userNovelRepository.findByUserIdAndNovelId(user.getId(), novelId)
                .orElseThrow(() -> new IllegalArgumentException("Novel not found in your list"));
        userNovelRepository.delete(userNovel);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private String normalizeStatus(String status) {
        return status == null || "WATCHED_READ".equals(status) ? "ONGOING" :
            "WATCHED".equals(status) ? "READ" : status;
    }
}
