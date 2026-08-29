package com.mediafetch.backend.notification.dto;

import java.time.LocalDateTime;

public record NotificationDto(
    Long id,
    String message,
    LocalDateTime createdAt,
    Boolean dismissed
) {}
