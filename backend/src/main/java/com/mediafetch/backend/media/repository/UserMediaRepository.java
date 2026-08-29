package com.mediafetch.backend.media.repository;

import com.mediafetch.backend.media.model.UserMedia;
import com.mediafetch.backend.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserMediaRepository extends JpaRepository<UserMedia, Long> {

    @Query("SELECT um FROM UserMedia um JOIN FETCH um.media WHERE um.user.id = :userId AND um.media.type = :type")
    List<UserMedia> findByUserIdAndMediaType(@Param("userId") Long userId, @Param("type") String type);

    @Query("SELECT um FROM UserMedia um WHERE um.user.id = :userId AND um.media.id = :mediaId")
    Optional<UserMedia> findByUserIdAndMediaId(@Param("userId") Long userId, @Param("mediaId") Integer mediaId);

    @Query("SELECT COUNT(um) > 0 FROM UserMedia um WHERE um.user.id = :userId AND um.media.id = :mediaId AND um.media.type = :type")
    boolean existsByUserIdAndMediaIdAndType(@Param("userId") Long userId, @Param("mediaId") Integer mediaId, @Param("type") String type);

    @Query("SELECT um.user FROM UserMedia um WHERE um.media.id = :mediaId AND um.status != 'WATCHED'")
    List<User> findUsersByMediaId(@Param("mediaId") Integer mediaId);
}
