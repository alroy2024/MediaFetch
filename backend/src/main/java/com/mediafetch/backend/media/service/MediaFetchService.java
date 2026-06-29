package com.mediafetch.backend.media.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.mediafetch.backend.media.dto.MediaResponse;
@Service
public class MediaFetchService {
    
    RestClient restClient = RestClient.builder()
    .baseUrl("https://api.jikan.moe/v4")
    .build();

    public MediaResponse getData(String params,String filter) {
        return restClient.get()
        .uri(uriBuilder -> uriBuilder.path(params).queryParam("filter",filter).build())
        .retrieve()
        .body(MediaResponse.class);        
    }

}
