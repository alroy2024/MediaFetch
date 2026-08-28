package com.mediafetch.backend.media.dto;

public record UserMediaDto(
    Integer id,
    String title,
    String image,
    String status,
    Boolean favorite,
    Integer currentChapter,
    Integer totalChapter
) {
    
}
