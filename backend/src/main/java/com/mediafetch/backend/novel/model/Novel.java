package com.mediafetch.backend.novel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "novel")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Novel {

    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String image;

    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer currentChapter = 0;

    @Column(nullable = false)
    private Integer totalChapter = 0;
}
