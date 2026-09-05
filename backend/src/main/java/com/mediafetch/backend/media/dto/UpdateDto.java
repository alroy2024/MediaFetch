package com.mediafetch.backend.media.dto;

public record UpdateDto(
    Integer id,
    Integer currentChapter,
    String status,
    Boolean favorite
) {
}
