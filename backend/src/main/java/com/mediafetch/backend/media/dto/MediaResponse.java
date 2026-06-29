package com.mediafetch.backend.media.dto;

import java.util.List;

public record MediaResponse(
    // Object pagination,
    List<MediaData> data
) {
    
}
