package com.daam.server.controller;

import com.daam.server.entity.Item;
import com.daam.server.repository.ItemRepository;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ItemController.class)
public class ItemControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ItemRepository itemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Item item;

    @BeforeEach
    void setUp() {
        item = new Item(1L, 1001L, 4L, 5.10, "Some notes", "Nora");
    }

    @Test
    @DisplayName("Test get item by ID - success")
    public void givenItemId1_whenGetItemById_thenReturnItemObject() throws Exception {
        // given
        given(itemRepository.findById(item.getId())).willReturn(Optional.of(item));

        // when & then
        mockMvc.perform(get("/api/items/{id}", item.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.firstname", is(item.getFirstname())));
    }

    @Test
    @DisplayName("Test get items by order ID")
    public void givenOrderId_whenGetItemsByOrderId_thenReturnItemList() throws Exception {
        // given
        List<Item> items = Collections.singletonList(item);
        given(itemRepository.findByOrderid(item.getOrderid())).willReturn(items);

        // when
        ResultActions response = mockMvc.perform(get("/api/items/order/{orderid}", item.getOrderid()));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @DisplayName("Test add items to an order")
    public void givenItemList_whenAddItemsToOrder_thenReturnSavedItems() throws Exception {
        // given
        List<Item> items = Collections.singletonList(item);
        given(itemRepository.saveAll(any(List.class))).willReturn(items);

        // when
        ResultActions response = mockMvc.perform(post("/api/items/order/{orderid}", item.getOrderid())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(items)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @DisplayName("Test delete all items from an order")
    public void givenOrderId_whenDeleteItemsFromOrder_thenReturnNoContent() throws Exception {
        // given
        long orderId = 1001L;
        willDoNothing().given(itemRepository).deleteByOrderid(orderId);

        // when
        ResultActions response = mockMvc.perform(delete("/api/items/order/{orderid}", orderId));

        // then
        response.andExpect(status().isNoContent());
    }
}