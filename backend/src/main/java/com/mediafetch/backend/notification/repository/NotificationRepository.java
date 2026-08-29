package com.mediafetch.backend.notification.repository;

import com.mediafetch.backend.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndDismissedFalseOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Notification> findByIdAndUserId(Long id, Long userId);
    Optional<Notification> findByUserIdAndNovelId(Long userId, Long novelId);
    Optional<Notification> findByUserIdAndMediaId(Long userId, Integer mediaId);
    boolean existsByUserIdAndMediaId(Long userId, Integer mediaId);
    boolean existsByUserIdAndMessage(Long userId, String message);
}
