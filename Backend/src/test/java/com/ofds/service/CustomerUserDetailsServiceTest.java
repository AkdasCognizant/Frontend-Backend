package com.ofds.service;

import com.ofds.entity.CustomerEntity;
import com.ofds.repository.CustomerRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerUserDetailsServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerUserDetailsService userDetailsService;

    @Test
    void testLoadUserByUsernameSuccess() {
        // Arrange
        CustomerEntity mockUser = new CustomerEntity();
        mockUser.setEmail("john@example.com");
        mockUser.setPassword("securePass");

        when(customerRepository.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("john@example.com");

        // Assert
        assertEquals("john@example.com", userDetails.getUsername());
        assertEquals("securePass", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty()); // ✅ Fixed assertion
        verify(customerRepository, times(1)).findByEmail("john@example.com");
    }

    @Test
    void testLoadUserByUsernameThrowsException() {
        // Arrange
        when(customerRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("missing@example.com");
        });

        verify(customerRepository, times(1)).findByEmail("missing@example.com");
    }
}
