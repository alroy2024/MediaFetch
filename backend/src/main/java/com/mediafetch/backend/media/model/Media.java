package com.mediafetch.backend.media.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "media")
@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class Media {
    @Id
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer currentChapter = 0;

    @Column(nullable = false)
    private Integer totalChapter = 0;

    @Column
    private String status = "ONGOING";

    @Column
    private Boolean favorite = false;

    // Reverse navigation is intentionally disabled until user-based media search is implemented.
    // @ManyToMany(mappedBy = "medias")
    // private Set<User> users = new HashSet<>();
}
