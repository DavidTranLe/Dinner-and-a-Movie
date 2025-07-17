package com.daam.server.controller;

import com.daam.server.entity.Order;
import com.daam.server.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.CoreMatchers.is;

@WebMvcTest(OrderController.class)
public class OrderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderRepository orderRepository;

    @Test
    public void givenOrderId1001_whenGetOrderById_thenReturnOrderObject() throws Exception {
        // given
        long orderId = 1001L;
        Order order = new Order(orderId, 3L, new Timestamp(System.currentTimeMillis()), null, "Theater 1", "Table 37", 5.33, 12.93, "4026...", 9, 2028, "completed");
        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));

        // when & then
        mockMvc.perform(get("/api/orders/{id}", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1001)))
                .andExpect(jsonPath("$.area", is(order.getArea())));
    }
}
