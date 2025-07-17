package com.daam.server.controller;

import com.daam.server.entity.Order;
import com.daam.server.repository.OrderRepository;
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

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
public class OrderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order(1001L, 3L, new Timestamp(System.currentTimeMillis()), null, "Theater 1", "Table 37", 5.33, 12.93, "4026...", 9, 2028, "completed");
    }

    @Test
    @DisplayName("Test get order by ID - success")
    public void givenOrderId1001_whenGetOrderById_thenReturnOrderObject() throws Exception {
        // given
        given(orderRepository.findById(order.getId())).willReturn(Optional.of(order));

        // when & then
        mockMvc.perform(get("/api/orders/{id}", order.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1001)))
                .andExpect(jsonPath("$.area", is(order.getArea())));
    }

    @Test
    @DisplayName("Test get orders by user ID")
    public void givenUserId_whenGetOrdersByUserId_thenReturnOrderList() throws Exception {
        // given
        List<Order> orders = Collections.singletonList(order);
        given(orderRepository.findByUserid(order.getUserid())).willReturn(orders);

        // when
        ResultActions response = mockMvc.perform(get("/api/orders/user/{userid}", order.getUserid()));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @DisplayName("Test create a new order")
    public void givenOrderObject_whenCreateOrder_thenReturnSavedOrder() throws Exception {
        // given
        given(orderRepository.save(any(Order.class)))
                .willAnswer((invocation) -> invocation.getArgument(0));

        // when
        ResultActions response = mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.area", is(order.getArea())));
    }
}