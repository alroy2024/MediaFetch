package com.mediafetch.backend.manga.dto;

import java.util.List;

public record MangaList(PageData data) {

    public record PageData(
            PageContainer releasingManga,
            PageContainer finishedManga

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