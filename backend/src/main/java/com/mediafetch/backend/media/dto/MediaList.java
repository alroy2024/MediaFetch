package com.mediafetch.backend.media.dto;

import java.util.List;

public record MediaList(PageData data) {

    public record PageData(
            PageContainer releasing,
            PageContainer finished

    ) {

        public record PageContainer(List<MediaDto> media) {
        }
    }
}