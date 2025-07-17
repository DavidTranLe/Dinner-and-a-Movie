package com.daam.server.controller;

import com.daam.server.entity.MenuItem;
import com.daam.server.repository.MenuItemRepository;
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

@WebMvcTest(MenuItemController.class)
public class MenuItemControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MenuItemRepository menuItemRepository;

    @Test
    public void givenMenuItemId1_whenGetMenuItemById_thenReturnMenuItemObject() throws Exception {
        // given
        long menuItemId = 1L;
        MenuItem menuItem = new MenuItem(menuItemId, "Bison Burger", "A tasty burger", "entrees", 11.54, "/images/food/burger_1.jpg", true);
        given(menuItemRepository.findById(menuItemId)).willReturn(Optional.of(menuItem));

        // when & then
        mockMvc.perform(get("/api/menuitems/{id}", menuItemId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(menuItem.getName())))
                .andExpect(jsonPath("$.price", is(menuItem.getPrice())));
    }

    @Test
    public void givenMenuItemId0_whenGetMenuItemById_thenReturnNotFound() throws Exception {
        // given
        long menuItemId = 0L;
        given(menuItemRepository.findById(menuItemId)).willReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/menuitems/{id}", menuItemId))
                .andExpect(status().isNotFound());
    }
}