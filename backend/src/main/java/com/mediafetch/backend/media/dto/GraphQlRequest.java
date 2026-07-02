package com.mediafetch.backend.media.dto;

public record GraphQlRequest(
    String query,
    Object variables
) {
}
