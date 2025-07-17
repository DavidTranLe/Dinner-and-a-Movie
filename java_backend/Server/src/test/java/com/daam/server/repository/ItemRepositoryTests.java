package com.daam.server.repository;

import com.daam.server.entity.Item;
import com.daam.server.entity.Order;
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
public class ItemRepositoryTests {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private ItemRepository itemRepository;

    private Order testOrder;
    private Item item1, item2;

    @BeforeEach
    void setUp() {
        Order order = new Order(null, 1L, new Timestamp(System.currentTimeMillis()), null, "Area 1", "Location 1", 1.0, 1.0, "1234", 1, 2025, "pending");
        testOrder = testEntityManager.persistAndFlush(order);

        item1 = new Item(null, testOrder.getId(), 1L, 10.0, "notes 1", "name 1");
        item2 = new Item(null, testOrder.getId(), 2L, 20.0, "notes 2", "name 2");
        testEntityManager.persist(item1);
        testEntityManager.persist(item2);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Test find all items by order ID")
    public void whenFindByOrderid_thenReturnItemList() {
        // when
        List<Item> foundItems = itemRepository.findByOrderid(testOrder.getId());

        // then
        assertThat(foundItems).hasSize(2);
        assertThat(foundItems).extracting(Item::getNotes).containsExactlyInAnyOrder("notes 1", "notes 2");
    }

    @Test
    @DisplayName("Test delete all items by order ID")
    public void whenDeleteByOrderid_thenItemsShouldBeDeleted() {
        // when
        itemRepository.deleteByOrderid(testOrder.getId());
        testEntityManager.flush();
        testEntityManager.clear();

        // then
        List<Item> foundItems = itemRepository.findByOrderid(testOrder.getId());
        assertThat(foundItems).isEmpty();
    }

    @Test
    @DisplayName("Test update an item")
    public void whenUpdateItem_thenReturnUpdatedItem() {
        // given
        Item savedItem = itemRepository.findById(item1.getId()).get();
        savedItem.setNotes("Updated notes");

        // when
        Item updatedItem = itemRepository.save(savedItem);

        // then
        assertThat(updatedItem.getNotes()).isEqualTo("Updated notes");
    }

    @Test
    @DisplayName("Test delete an item by its ID")
    public void whenDeleteById_thenItemShouldBeDeleted() {
        // when
        itemRepository.deleteById(item1.getId());
        Optional<Item> deletedItem = itemRepository.findById(item1.getId());

        // then
        assertThat(deletedItem).isEmpty();
    }
}
