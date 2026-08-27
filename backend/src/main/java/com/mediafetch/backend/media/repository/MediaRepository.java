package com.mediafetch.backend.media.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediafetch.backend.media.model.Media;
import java.util.List;
public interface MediaRepository extends JpaRepository<Media,Integer>{ 
    @Query("SELECT m FROM User u JOIN u.medias m WHERE u.id = :userId AND m.type = :type")
    List<Media> findMediasByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.medias m WHERE u.id = :userID AND m.id = :mediaId AND m.type = :type")
    Boolean hasMedia(@Param("userID") Long userId,@Param("mediaId") Integer mediaId, @Param("type") String type);
}

