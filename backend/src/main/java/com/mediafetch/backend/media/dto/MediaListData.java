package com.mediafetch.backend.media.dto;

public record MediaListData(
    MediaResponse TopAnime,
    MediaResponse Trending,
    MediaResponse MustWatch
) {
    
}
