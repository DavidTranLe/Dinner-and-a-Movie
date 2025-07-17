package com.daam.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Date;

@Entity
@Table(name = "film")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private String homepage;
    private Date releasedate;
    @Column(length = 2048)
    private String overview;
    private String posterpath;
    private Integer runtime;
    private String tagline;
    private Double popularity;
    private String imdbid;
    private Double voteaverage;
    private Integer votecount;
}