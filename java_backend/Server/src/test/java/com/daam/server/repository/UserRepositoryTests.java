package com.daam.server.repository;

import com.daam.server.entity.User;
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
public class UserRepositoryTests {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private UserRepository userRepository;

    private User user1;

    @BeforeEach
    void setUp() {
        user1 = new User(null, "testuser1", "password", "Test", "User1", null, "test1@test.com", null, null, null, null, "ROLE_USER");
        testEntityManager.persist(user1);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Test save and find user by ID")
    public void whenSaveUser_thenFindById() {
        // given
        User newUser = new User(null, "newuser", "password", "New", "User", null, "new@test.com", null, null, null, null, "ROLE_USER");

        // when
        User savedUser = userRepository.save(newUser);
        User foundUser = userRepository.findById(savedUser.getId()).orElse(null);

        // then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUsername()).isEqualTo(newUser.getUsername());
    }

    @Test
    @DisplayName("Test find all users")
    public void whenFindAll_thenReturnUserList() {
        // given
        User user2 = new User(null, "testuser2", "password", "Test", "User2", null, "test2@test.com", null, null, null, null, "ROLE_USER");
        testEntityManager.persist(user2);
        testEntityManager.flush();

        // when
        List<User> users = userRepository.findAll();

        // then
        assertThat(users).hasSize(2);
    }

    @Test
    @DisplayName("Test delete a user")
    public void whenDeleteUser_thenUserShouldBeDeleted() {
        // when
        userRepository.deleteById(user1.getId());
        Optional<User> deletedUser = userRepository.findById(user1.getId());

        // then
        assertThat(deletedUser).isEmpty();
    }
}