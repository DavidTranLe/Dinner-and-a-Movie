package com.daam.server.controller;

import com.daam.server.entity.Film;
import com.daam.server.repository.FilmRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FilmController.class)
public class FilmControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FilmRepository filmRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Film film;

    @BeforeEach
    void setUp() {
        film = new Film(1L, "Chunnel", "http://chunnelmovie.com", null, "Overview here", "/images/posters/1.jpg", 120, "Tagline here", 7.1, "tt0137523", 6.2, 52);
    }

    @Test
    @DisplayName("Test get film by ID - success")
    public void givenFilmId_whenGetFilmById_thenReturnFilmObject() throws Exception {
        // given
        given(filmRepository.findById(film.getId())).willReturn(Optional.of(film));

        // when & then
        mockMvc.perform(get("/api/films/{id}", film.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(film.getTitle())))
                .andExpect(jsonPath("$.tagline", is(film.getTagline())));
    }

    @Test
    @DisplayName("Test create a new film")
    public void givenFilmObject_whenCreateFilm_thenReturnSavedFilm() throws Exception {
        // given
        given(filmRepository.save(any(Film.class)))
                .willAnswer((invocation) -> invocation.getArgument(0));

        // when
        ResultActions response = mockMvc.perform(post("/api/films")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(film)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is(film.getTitle())));
    }
}