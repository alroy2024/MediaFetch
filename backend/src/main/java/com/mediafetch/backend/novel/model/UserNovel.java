package com.mediafetch.backend.novel.model;

import com.mediafetch.backend.auth.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "user_novel", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "novel_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserNovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "novel_id", nullable = false)
    private Novel novel;

    @Column(nullable = false)
    private Integer currentChapter = 0;

    @Column(nullable = false)
    private String status = "ONGOING";

    @Column(nullable = false)
    private Boolean favorite = false;
}
