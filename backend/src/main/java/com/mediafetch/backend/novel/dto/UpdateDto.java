package com.mediafetch.backend.novel.dto;

public record UpdateDto(
    Long id,
    Integer currentChapter,
    String status,
    Boolean favorite
) {
}
