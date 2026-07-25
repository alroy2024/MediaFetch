package com.mediafetch.backend.media.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mediafetch.backend.media.model.Media;

public interface MediaRepository extends JpaRepository<Media,Integer>{
}
