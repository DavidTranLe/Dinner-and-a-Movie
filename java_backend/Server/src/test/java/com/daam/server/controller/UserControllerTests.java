package com.daam.server.controller;

import com.daam.server.entity.User;
import com.daam.server.repository.UserRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User(1L, "admin", "pass", "Admin", "User", null, "admin@daam.com", null, null, null, null, "ROLE_ADMIN");
    }

    @Test
    @DisplayName("Test get all users")
    public void givenListOfUsers_whenGetAllUsers_thenReturnUsersList() throws Exception {
        // given
        List<User> users = new ArrayList<>();
        users.add(user);
        users.add(new User(2L, "user2", "pass", "User", "Two", null, "user2@daam.com", null, null, null, null, "ROLE_USER"));
        given(userRepository.findAll()).willReturn(users);

        // when
        ResultActions response = mockMvc.perform(get("/api/users"));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(users.size())));
    }

    @Test
    @DisplayName("Test get user by ID - success")
    public void givenUserId_whenGetUserById_thenReturnUserObject() throws Exception {
        // given
        given(userRepository.findById(user.getId())).willReturn(Optional.of(user));

        // when
        ResultActions response = mockMvc.perform(get("/api/users/{id}", user.getId()));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is(user.getUsername())))
                .andExpect(jsonPath("$.first", is(user.getFirst())));
    }

    @Test
    @DisplayName("Test get user by ID - failure (not found)")
    public void givenInvalidUserId_whenGetUserById_thenReturnNotFound() throws Exception {
        // given
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        // when
        ResultActions response = mockMvc.perform(get("/api/users/{id}", 999L));

        // then
        response.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test create a new user")
    public void givenUserObject_whenCreateUser_thenReturnSavedUser() throws Exception {
        // given
        given(userRepository.save(any(User.class)))
                .willAnswer((invocation) -> invocation.getArgument(0));

        // when
        ResultActions response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", is(user.getUsername())));
    }

    @Test
    @DisplayName("Test update a user - success")
    public void givenUpdatedUser_whenUpdateUser_thenReturnUpdatedUserObject() throws Exception {
        // given
        User updatedUser = new User(user.getId(), "updatedAdmin", "newpass", "Updated", "Admin", null, "updated@daam.com", null, null, null, null, "ROLE_ADMIN");
        given(userRepository.findById(user.getId())).willReturn(Optional.of(user));
        given(userRepository.save(any(User.class)))
                .willAnswer((invocation) -> invocation.getArgument(0));

        // when
        ResultActions response = mockMvc.perform(put("/api/users/{id}", user.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is(updatedUser.getUsername())))
                .andExpect(jsonPath("$.first", is(updatedUser.getFirst())));
    }

    @Test
    @DisplayName("Test update a user - failure (not found)")
    public void givenUpdatedUser_whenUpdateUserWithInvalidId_thenReturnNotFound() throws Exception {
        // given
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        // when
        ResultActions response = mockMvc.perform(put("/api/users/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));

        // then
        response.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test delete a user - success")
    public void givenUserId_whenDeleteUser_thenReturnNoContent() throws Exception {
        // given
        given(userRepository.existsById(user.getId())).willReturn(true);
        willDoNothing().given(userRepository).deleteById(user.getId());

        // when
        ResultActions response = mockMvc.perform(delete("/api/users/{id}", user.getId()));

        // then
        response.andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Test delete a user - failure (not found)")
    public void givenInvalidUserId_whenDeleteUser_thenReturnNotFound() throws Exception {
        // given
        given(userRepository.existsById(999L)).willReturn(false);

        // when
        ResultActions response = mockMvc.perform(delete("/api/users/{id}", 999L));

        // then
        response.andExpect(status().isNotFound());
    }
}