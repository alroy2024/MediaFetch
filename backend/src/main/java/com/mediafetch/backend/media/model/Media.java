package com.mediafetch.backend.media.model;
import java.util.HashSet;
import java.util.Set;

import com.mediafetch.backend.auth.model.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
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

    @ManyToMany(mappedBy = "medias")
    private Set<User> users  = new HashSet<>(); 
}
