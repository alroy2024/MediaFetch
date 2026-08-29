package com.mediafetch.backend.notification.controller;

import com.mediafetch.backend.notification.dto.NotificationDto;
import com.mediafetch.backend.notification.service.NotificationService;
import com.mediafetch.backend.novel.scheduler.NovelUpdateScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NovelUpdateScheduler novelUpdateScheduler;

    @GetMapping
    public List<NotificationDto> getNotifications(@AuthenticationPrincipal UserDetails currentUser) {
        return notificationService.getNotificationsForUser(currentUser.getUsername());
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id, @AuthenticationPrincipal UserDetails currentUser) {
        notificationService.deleteNotification(id, currentUser.getUsername());
    }

    @PostMapping("/trigger-update")
    public void triggerUpdate(@AuthenticationPrincipal UserDetails currentUser) {
        novelUpdateScheduler.updateNovelsAndNotifyForUser(currentUser.getUsername());
    }
}
