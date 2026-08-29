package com.mediafetch.backend.media.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mediafetch.backend.media.model.Media;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Integer> {
    List<Media> findByTypeAndNextAiringAtLessThanEqual(String type, Long time);
}
