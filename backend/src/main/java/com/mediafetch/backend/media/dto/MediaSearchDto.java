package com.mediafetch.backend.media.dto;

import java.util.List;

public record MediaSearchDto(PageData data) {
    public record PageData(PageContainer Page){
    public record PageContainer(List<MediaDto> media){
    }
    }
}
