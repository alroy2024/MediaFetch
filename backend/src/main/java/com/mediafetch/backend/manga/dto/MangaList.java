package com.mediafetch.backend.manga.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MangaList(PageData data) {

    public record PageData(
            @JsonProperty("Page")
            PageContainer page
    ) {

        public record PageContainer(List<Media> media) {

            public record Media(
                    Integer id,
                    Title title,
                    CoverImage coverImage  
            ) {

                public record Title(String romaji) {
                }

                public record CoverImage(String large) {
                }
            }
        }
    }
}