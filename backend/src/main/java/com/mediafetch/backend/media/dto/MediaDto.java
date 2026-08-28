package com.mediafetch.backend.media.dto;

public record MediaDto(
            Integer id,
            Title title,
            CoverImage coverImage,
            String description,
            Integer episodes,
            Integer chapters
    ) {

        public record Title(String romaji, String english) {
        }
        public record CoverImage(String large) {
        }
    }

