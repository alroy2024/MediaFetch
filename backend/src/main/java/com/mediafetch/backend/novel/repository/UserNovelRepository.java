package com.mediafetch.backend.novel.repository;

import com.mediafetch.backend.novel.model.UserNovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserNovelRepository extends JpaRepository<UserNovel, Long> {

    @Query("SELECT un FROM UserNovel un JOIN FETCH un.novel WHERE un.user.id = :userId")
    List<UserNovel> findByUserId(@Param("userId") Long userId);

    @Query("SELECT un FROM UserNovel un WHERE un.user.id = :userId AND un.novel.id = :novelId")
    Optional<UserNovel> findByUserIdAndNovelId(@Param("userId") Long userId, @Param("novelId") Long novelId);

    @Query("SELECT COUNT(un) > 0 FROM UserNovel un WHERE un.user.id = :userId AND un.novel.id = :novelId")
    boolean existsByUserIdAndNovelId(@Param("userId") Long userId, @Param("novelId") Long novelId);

    @Query("SELECT un FROM UserNovel un JOIN FETCH un.user WHERE un.novel.id = :novelId")
    List<UserNovel> findByNovelId(@Param("novelId") Long novelId);
}

