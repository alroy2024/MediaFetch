package com.mediafetch.backend.media.model;

import com.mediafetch.backend.auth.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "user_media", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "media_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_id", nullable = false)
    private Media media;

    @Column(nullable = false)
    private Integer currentChapter = 0;

    @Column(nullable = false)
    private String status = "ONGOING";

    @Column(nullable = false)
    private Boolean favorite = false;
}
