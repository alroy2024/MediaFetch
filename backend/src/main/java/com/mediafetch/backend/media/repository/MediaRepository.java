package com.mediafetch.backend.media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.media.model.Media;

public interface MediaRepository extends JpaRepository<Media,Integer>{
    List<Media> findByUserId(Long userId);
    Boolean existsByUserAndId(User user,Integer id);
}
