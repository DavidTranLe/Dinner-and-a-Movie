package com.daam.server.repository;

import com.daam.server.entity.MenuItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class MenuItemRepositoryTests {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private MenuItemRepository menuItemRepository;

    private MenuItem menuItem1;

    @BeforeEach
    void setUp() {
        menuItem1 = new MenuItem(null, "Test Burger", "A test burger", "entrees", 9.99, "/images/test.jpg", true);
        testEntityManager.persist(menuItem1);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Test save and find menu item by ID")
    public void whenSaveMenuItem_thenFindById() {
        // when
        MenuItem foundItem = menuItemRepository.findById(menuItem1.getId()).orElse(null);

        // then
        assertThat(foundItem).isNotNull();
        assertThat(foundItem.getName()).isEqualTo(menuItem1.getName());
    }

    @Test
    @DisplayName("Test find all menu items")
    public void whenFindAll_thenReturnMenuItemList() {
        // given
        MenuItem menuItem2 = new MenuItem(null, "Test Drink", "A test drink", "drinks", 1.99, "/images/drink.jpg", true);
        testEntityManager.persist(menuItem2);
        testEntityManager.flush();

        // when
        List<MenuItem> menuItems = menuItemRepository.findAll();

        // then
        assertThat(menuItems).hasSize(2);
    }

    @Test
    @DisplayName("Test delete a menu item")
    public void whenDeleteMenuItem_thenMenuItemShouldBeDeleted() {
        // when
        menuItemRepository.deleteById(menuItem1.getId());
        Optional<MenuItem> deletedItem = menuItemRepository.findById(menuItem1.getId());

        // then
        assertThat(deletedItem).isEmpty();
    }
}
