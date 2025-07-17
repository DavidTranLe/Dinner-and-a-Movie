package com.daam.server.repository;

import com.daam.server.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByOrderid(Long orderid);

    // The @Transactional annotation is needed for delete operations
    @Transactional
    void deleteByOrderid(Long orderid);
}