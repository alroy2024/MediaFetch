package com.mediafetch.backend.media.dto;

import java.util.List;

public record MediaList(PageData data) {

    public record PageData(
            PageContainer releasing,
            PageContainer finished

    ) {

        public record PageContainer(List<Media> media) {

            public record Media(
                    Integer id,
                    Title title,
                    CoverImage coverImage  
            ) {

                public record Title(String romaji, String english) {
                }

                public record CoverImage(String large) {
                }
            }
        }
    }
}