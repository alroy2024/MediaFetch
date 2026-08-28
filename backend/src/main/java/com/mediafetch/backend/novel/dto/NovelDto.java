package com.mediafetch.backend.novel.dto;

public record NovelDto(
    Long id,
    String title,
    String image,
    String url,
    String description,
    Integer currentChapter,
    Integer totalChapter,
    String status,
    Boolean favorite
) {
    
}
