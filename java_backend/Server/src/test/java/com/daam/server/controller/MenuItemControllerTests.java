package com.daam.server.controller;

import com.daam.server.entity.MenuItem;
import com.daam.server.repository.MenuItemRepository;
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
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MenuItemController.class)
public class MenuItemControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MenuItem menuItem;

    @BeforeEach
    void setUp() {
        menuItem = new MenuItem(1L, "Bison Burger", "A tasty burger", "entrees", 11.54, "/images/food/burger_1.jpg", true);
    }

    @Test
    @DisplayName("Test get menu item by ID - success")
    public void givenMenuItemId1_whenGetMenuItemById_thenReturnMenuItemObject() throws Exception {
        // given
        given(menuItemRepository.findById(menuItem.getId())).willReturn(Optional.of(menuItem));

        // when & then
        mockMvc.perform(get("/api/menuitems/{id}", menuItem.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(menuItem.getName())))
                .andExpect(jsonPath("$.price", is(menuItem.getPrice())));
    }

    @Test
    @DisplayName("Test get menu item by ID - failure (not found)")
    public void givenMenuItemId0_whenGetMenuItemById_thenReturnNotFound() throws Exception {
        // given
        given(menuItemRepository.findById(0L)).willReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/menuitems/{id}", 0L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test create a new menu item")
    public void givenMenuItemObject_whenCreateMenuItem_thenReturnSavedMenuItem() throws Exception {
        // given
        given(menuItemRepository.save(any(MenuItem.class)))
                .willAnswer((invocation) -> invocation.getArgument(0));

        // when
        ResultActions response = mockMvc.perform(post("/api/menuitems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuItem)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is(menuItem.getName())));
    }

    @Test
    @DisplayName("Test delete a menu item - success")
    public void givenMenuItemId_whenDeleteMenuItem_thenReturnNoContent() throws Exception {
        // given
        given(menuItemRepository.existsById(menuItem.getId())).willReturn(true);
        willDoNothing().given(menuItemRepository).deleteById(menuItem.getId());

        // when
        ResultActions response = mockMvc.perform(delete("/api/menuitems/{id}", menuItem.getId()));

        // then
        response.andExpect(status().isNoContent());
    }
}