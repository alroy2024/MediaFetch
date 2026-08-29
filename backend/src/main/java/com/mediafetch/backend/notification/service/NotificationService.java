package com.mediafetch.backend.notification.service;

import com.mediafetch.backend.auth.model.User;
import com.mediafetch.backend.auth.repository.UserRepository;
import com.mediafetch.backend.media.model.Media;
import com.mediafetch.backend.novel.model.Novel;
import com.mediafetch.backend.notification.dto.NotificationDto;
import com.mediafetch.backend.notification.model.Notification;
import com.mediafetch.backend.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationDto> getNotificationsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(n -> new NotificationDto(n.getId(), n.getMessage(), n.getCreatedAt(), n.getDismissed()))
                .toList();
    }

    @Transactional
    public void deleteNotification(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Notification not found or access denied"));
        notification.setDismissed(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void createNotification(User user, Novel novel, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNovel(novel);
        notification.setMessage(message);
        notification.setDismissed(false);
        notificationRepository.save(notification);
    }

    public Optional<Notification> getNotificationByUserAndNovel(Long userId, Long novelId) {
        return notificationRepository.findByUserIdAndNovelId(userId, novelId);
    }

    @Transactional
    public void save(Notification notification) {
        notificationRepository.save(notification);
    }

    @Transactional
    public void delete(Notification notification) {
        notificationRepository.delete(notification);
    }

    public boolean hasNotification(Long userId, String message) {
        return notificationRepository.existsByUserIdAndMessage(userId, message);
    }

    public boolean hasNotificationForMedia(Long userId, Integer mediaId) {
        return notificationRepository.existsByUserIdAndMediaId(userId, mediaId);
    }

    @Transactional
    public void createMediaNotification(User user, Media media, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMedia(media);
        notification.setMessage(message);
        notification.setDismissed(false);
        notificationRepository.save(notification);
    }

    @Transactional
    public void updateMediaNotification(Long userId, Integer mediaId, String message) {
        notificationRepository.findByUserIdAndMediaId(userId, mediaId).ifPresent(notif -> {
            notif.setMessage(message);
            notif.setDismissed(false);
            notif.setCreatedAt(java.time.LocalDateTime.now());
            notificationRepository.save(notif);
        });
    }
}
