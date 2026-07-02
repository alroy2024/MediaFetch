package com.mediafetch.backend.manga.dto;

public record GraphQlRequest(
    String query,
    Object variables
) {
    
}
