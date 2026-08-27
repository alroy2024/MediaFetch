package com.mediafetch.backend.media.dto;

public record RequestDto(
    String searchQuery,
    String type
) {
}
