package com.mediafetch.backend.novel.dto;

public record NovelDto(
    Long id,
    String title,
    String image,
    Integer currentChapter,
    Integer totalChapter
) {
    
}
