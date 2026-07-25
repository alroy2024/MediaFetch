package com.mediafetch.backend.media.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "media")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Media {
    @Id
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String image;
}
