package com.ofds.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "restaurant")
public class RestaurantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String ownerName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Double rating;
    private String imageUrl;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItemEntity> menuItems;

    // One-to-Many to Carts
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<CartEntity> carts;

    // One-to-Many to Orders
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<OrdersEntity> orders;
}
