package com.daam.server.controller;

import com.daam.server.entity.User;
import com.daam.server.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

@WebMvcTest(UserController.class)
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void givenUserId_whenGetUserById_thenReturnUserObject() throws Exception {
        // given - setup or precondition
        long userId = 1L;
        User user = new User(userId, "admin", "pass", "Admin", "User", null, "admin@daam.com", null, null, null, null, "ROLE_ADMIN");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // when - action or behavior that we are going to test
        // then - verify the result or output
        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is(user.getUsername())))
                .andExpect(jsonPath("$.first", is(user.getFirst())));
    }

    @Test
    public void givenInvalidUserId_whenGetUserById_thenReturnNotFound() throws Exception {
        // given - setup or precondition
        long userId = 999L;
        given(userRepository.findById(userId)).willReturn(Optional.empty());

        // when - action or behavior that we are going to test
        // then - verify the result or output
        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isNotFound());
    }
}
