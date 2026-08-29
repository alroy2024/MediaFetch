package com.mediafetch.backend.novel.scheduler;

import com.mediafetch.backend.novel.model.Novel;
import com.mediafetch.backend.novel.model.UserNovel;
import com.mediafetch.backend.novel.repository.NovelRepository;
import com.mediafetch.backend.novel.repository.UserNovelRepository;
import com.mediafetch.backend.novel.service.NovelFetchService;
import com.mediafetch.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NovelUpdateScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NovelUpdateScheduler.class);

    private final NovelRepository novelRepository;
    private final UserNovelRepository userNovelRepository;
    private final NovelFetchService novelFetchService;
    private final NotificationService notificationService;
    private final com.mediafetch.backend.auth.repository.UserRepository userRepository;

    // Run every 6 hours
    @Scheduled(cron = "0 0 */6 * * *")
    public void runUpdateSchedule() {
        logger.info("Starting background novel update job...");
        updateNovelsAndNotify();
        logger.info("Background novel update job finished.");
    }

    public void updateNovelsAndNotifyForUser(String username) {
        com.mediafetch.backend.auth.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<UserNovel> userNovels = userNovelRepository.findByUserId(user.getId());
        logger.info("Triggering user-specific update check for user: {}. Found {} novels to check.", username, userNovels.size());

        for (UserNovel un : userNovels) {
            Novel novel = un.getNovel();
            try {
                logger.info("Fetching current chapter for novel ID {} ({}) for user {}", novel.getId(), novel.getTitle(), username);
                int latestChapter = novelFetchService.fetchCurrentChapter(novel.getUrl());
                logger.info("Scraped chapter count: {}. Existing DB chapter count: {}", latestChapter, novel.getTotalChapter());

                if (latestChapter > 0 && latestChapter > novel.getTotalChapter()) {
                    novel.setTotalChapter(latestChapter);
                    novelRepository.save(novel);
                    logger.info("Updated total chapter to {} for novel ID {}", latestChapter, novel.getId());
                }

                int diff = novel.getTotalChapter() - un.getCurrentChapter();
                if (diff > 0) {
                    String message = "There are " + diff + " new chapters to read for \"" + novel.getTitle() + "\"";
                    java.util.Optional<com.mediafetch.backend.notification.model.Notification> opt = notificationService.getNotificationByUserAndNovel(user.getId(), novel.getId());
                    if (opt.isPresent()) {
                        com.mediafetch.backend.notification.model.Notification notif = opt.get();
                        notif.setMessage(message);
                        notif.setDismissed(false);
                        notif.setCreatedAt(java.time.LocalDateTime.now());
                        notificationService.save(notif);
                        logger.info("Updated existing notification for user ID {} to: {}", user.getId(), message);
                    } else {
                        notificationService.createNotification(user, novel, message);
                        logger.info("Created new notification for user ID {} about \"{}\"", user.getId(), novel.getTitle());
                    }
                } else {
                    notificationService.getNotificationByUserAndNovel(user.getId(), novel.getId())
                        .ifPresent(notif -> {
                            if (!notif.getDismissed()) {
                                notif.setDismissed(true);
                                notificationService.save(notif);
                                logger.info("Marked notification for user ID {} as dismissed/read as they caught up with \"{}\"", user.getId(), novel.getTitle());
                            }
                        });
                }
            } catch (Exception e) {
                logger.error("Error updating novel ID {} ({}): {}", novel.getId(), novel.getTitle(), e.getMessage(), e);
            }
        }
    }

    public void updateNovelsAndNotify() {
        List<Novel> novels = novelRepository.findAll();
        logger.info("Found {} novels in database to check for updates.", novels.size());

        for (Novel novel : novels) {
            try {
                logger.info("Fetching current chapter for novel ID {} ({})", novel.getId(), novel.getTitle());
                int latestChapter = novelFetchService.fetchCurrentChapter(novel.getUrl());
                logger.info("Scraped chapter count: {}. Existing DB chapter count: {}", latestChapter, novel.getTotalChapter());

                if (latestChapter > 0 && latestChapter > novel.getTotalChapter()) {
                    novel.setTotalChapter(latestChapter);
                    novelRepository.save(novel);
                    logger.info("Updated total chapter to {} for novel ID {}", latestChapter, novel.getId());
                }

                List<UserNovel> userNovels = userNovelRepository.findByNovelId(novel.getId());
                for (UserNovel un : userNovels) {
                    int diff = novel.getTotalChapter() - un.getCurrentChapter();
                    if (diff > 0) {
                        String message = "There are " + diff + " new chapters to read for \"" + novel.getTitle() + "\"";
                        java.util.Optional<com.mediafetch.backend.notification.model.Notification> opt = notificationService.getNotificationByUserAndNovel(un.getUser().getId(), novel.getId());
                        if (opt.isPresent()) {
                            com.mediafetch.backend.notification.model.Notification notif = opt.get();
                            notif.setMessage(message);
                            notif.setDismissed(false);
                            notif.setCreatedAt(java.time.LocalDateTime.now());
                            notificationService.save(notif);
                            logger.info("Updated existing notification for user ID {} to: {}", un.getUser().getId(), message);
                        } else {
                            notificationService.createNotification(un.getUser(), novel, message);
                            logger.info("Created new notification for user ID {} about \"{}\"", un.getUser().getId(), novel.getTitle());
                        }
                    } else {
                        notificationService.getNotificationByUserAndNovel(un.getUser().getId(), novel.getId())
                            .ifPresent(notif -> {
                                if (!notif.getDismissed()) {
                                    notif.setDismissed(true);
                                    notificationService.save(notif);
                                    logger.info("Marked notification for user ID {} as dismissed/read as they caught up with \"{}\"", un.getUser().getId(), novel.getTitle());
                                }
                            });
                    }
                }
            } catch (Exception e) {
                logger.error("Error updating novel ID {} ({}): {}", novel.getId(), novel.getTitle(), e.getMessage(), e);
            }
        }
    }
}
