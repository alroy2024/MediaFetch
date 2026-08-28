package com.mediafetch.backend.media.dto;

public record AddDto(
    String id,
    String english,
    String romaji,
    String image,
    String type,
    Integer currentChapter,
    Integer totalChapter,
    String status,
    Boolean favorite
) {
}
