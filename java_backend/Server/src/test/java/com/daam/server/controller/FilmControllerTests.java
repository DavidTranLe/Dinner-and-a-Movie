package com.daam.server.controller;

import com.daam.server.entity.Film;
import com.daam.server.repository.FilmRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.CoreMatchers.is;

@WebMvcTest(FilmController.class)
public class FilmControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FilmRepository filmRepository;

    @Test
    public void givenFilmId_whenGetFilmById_thenReturnFilmObject() throws Exception {
        // given
        long filmId = 1L;
        Film film = new Film(filmId, "Chunnel", "http://chunnelmovie.com", null, "Overview here", "/images/posters/1.jpg", 120, "Tagline here", 7.1, "tt0137523", 6.2, 52);
        given(filmRepository.findById(filmId)).willReturn(Optional.of(film));

        // when & then
        mockMvc.perform(get("/api/films/{id}", filmId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(film.getTitle())))
                .andExpect(jsonPath("$.tagline", is(film.getTagline())));
    }
}
