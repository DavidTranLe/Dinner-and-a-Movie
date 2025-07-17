package com.daam.server.repository;

import com.daam.server.entity.Order;
import com.daam.server.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class OrderRepositoryTests {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private OrderRepository orderRepository;

    private User testUser;
    private Order order1, order2;

    @BeforeEach
    void setUp() {
        User user = new User(null, "testuser", "password", "Test", "User", null, "test@test.com", null, null, null, null, "ROLE_USER");
        testUser = testEntityManager.persistAndFlush(user);

        order1 = new Order(null, testUser.getId(), new Timestamp(System.currentTimeMillis()), null, "Area 1", "Location 1", 1.0, 1.0, "1234", 1, 2025, "pending");
        order2 = new Order(null, testUser.getId(), new Timestamp(System.currentTimeMillis()), null, "Area 2", "Location 2", 2.0, 2.0, "5678", 2, 2026, "completed");

        testEntityManager.persist(order1);
        testEntityManager.persist(order2);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Test find all orders by user ID")
    public void whenFindByUserid_thenReturnOrderList() {
        // when
        List<Order> foundOrders = orderRepository.findByUserid(testUser.getId());

        // then
        assertThat(foundOrders).isNotNull();
        assertThat(foundOrders.size()).isEqualTo(2);
        assertThat(foundOrders).contains(order1, order2);
    }

    @Test
    @DisplayName("Test find all orders")
    public void whenFindAll_thenReturnOrderList() {
        // when
        List<Order> orders = orderRepository.findAll();

        // then
        assertThat(orders).isNotNull();
        assertThat(orders.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("Test find order by non-existent ID")
    public void whenFindById_withInvalidId_thenReturnEmpty() {
        // when
        Optional<Order> foundOrder = orderRepository.findById(999L);

        // then
        assertThat(foundOrder).isEmpty();
    }

    @Test
    @DisplayName("Test update an order")
    public void whenUpdateOrder_thenReturnUpdatedOrder() {
        // given
        Order savedOrder = orderRepository.findById(order1.getId()).get();
        savedOrder.setStatus("shipped");

        // when
        Order updatedOrder = orderRepository.save(savedOrder);

        // then
        assertThat(updatedOrder.getStatus()).isEqualTo("shipped");
    }

    @Test
    @DisplayName("Test delete an order")
    public void whenDeleteOrder_thenOrderShouldBeDeleted() {
        // when
        orderRepository.deleteById(order1.getId());
        Optional<Order> deletedOrder = orderRepository.findById(order1.getId());

        // then
        assertThat(deletedOrder).isEmpty();
    }
}