package com.daam.server.repository;

import com.daam.server.entity.Film;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class FilmRepositoryTests {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private FilmRepository filmRepository;

    private Film film1;

    @BeforeEach
    void setUp() {
        film1 = new Film(null, "Test Movie 1", null, null, "An overview 1", null, 120, "A tagline 1", 8.0, null, 8.0, 100);
        testEntityManager.persist(film1);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Test save and find film by ID")
    public void whenSaveFilm_thenFindById() {
        // when
        Film foundFilm = filmRepository.findById(film1.getId()).orElse(null);

        // then
        assertThat(foundFilm).isNotNull();
        assertThat(foundFilm.getTitle()).isEqualTo(film1.getTitle());
    }

    @Test
    @DisplayName("Test find all films")
    public void whenFindAll_thenReturnFilmList() {
        // given
        Film film2 = new Film(null, "Test Movie 2", null, null, "An overview 2", null, 90, "A tagline 2", 7.0, null, 7.0, 50);
        testEntityManager.persist(film2);
        testEntityManager.flush();

        // when
        List<Film> films = filmRepository.findAll();

        // then
        assertThat(films).hasSize(2);
    }

    @Test
    @DisplayName("Test delete a film")
    public void whenDeleteFilm_thenFilmShouldBeDeleted() {
        // when
        filmRepository.deleteById(film1.getId());
        Optional<Film> deletedFilm = filmRepository.findById(film1.getId());

        // then
        assertThat(deletedFilm).isEmpty();
    }
}