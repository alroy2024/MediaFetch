package com.mediafetch.backend.media.dto;

public record MediaData(
    String mal_id,
    MediaImage images,
    String title
) {
    
}
