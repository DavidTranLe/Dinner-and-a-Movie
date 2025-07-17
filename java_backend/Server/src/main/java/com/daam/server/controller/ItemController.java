package com.daam.server.controller;

import com.daam.server.entity.Item;
import com.daam.server.repository.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));
        return ResponseEntity.ok(item);
    }

    @GetMapping("/order/{orderid}")
    public List<Item> getItemsByOrderId(@PathVariable Long orderid) {
        return itemRepository.findByOrderid(orderid);
    }

    @PostMapping("/order/{orderid}")
    public ResponseEntity<List<Item>> addItemsToOrder(@PathVariable Long orderid, @Valid @RequestBody List<Item> items) {
        // Ensure each item is associated with the correct order ID
        List<Item> itemsToSave = items.stream().peek(item -> item.setOrderid(orderid)).collect(Collectors.toList());
        List<Item> savedItems = itemRepository.saveAll(itemsToSave);
        return new ResponseEntity<>(savedItems, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @Valid @RequestBody Item itemDetails) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));

        item.setPrice(itemDetails.getPrice());
        item.setNotes(itemDetails.getNotes());
        item.setFirstname(itemDetails.getFirstname());

        Item updatedItem = itemRepository.save(item);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (!itemRepository.existsById(id)) {
            throw new EntityNotFoundException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping("/order/{orderid}")
    public ResponseEntity<Void> deleteItemsFromOrder(@PathVariable Long orderid) {
        itemRepository.deleteByOrderid(orderid);
        return ResponseEntity.noContent().build();
    }}
