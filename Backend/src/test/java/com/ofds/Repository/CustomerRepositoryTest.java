package com.ofds.Repository;

import com.ofds.entity.CustomerEntity;
import com.ofds.repository.CustomerRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerRepositoryTest {

	    @Mock
	    private CustomerRepository customerRepository;

	    @Test
	    void testFindByEmailReturnsCustomer() {
	        // Arrange
	        String email = "test@example.com";
	        CustomerEntity mockCustomer = new CustomerEntity();
	        mockCustomer.setEmail(email);
	        mockCustomer.setName("Test User");

	        when(customerRepository.findByEmail(email)).thenReturn(Optional.of(mockCustomer));

	        // Act
	        Optional<CustomerEntity> result = customerRepository.findByEmail(email);

	        // Assert
	        assertTrue(result.isPresent());
	        assertEquals("Test User", result.get().getName());
	        verify(customerRepository, times(1)).findByEmail(email);
	    }

	    @Test
	    void testFindByEmailReturnsEmpty() {
	        // Arrange
	        String email = "notfound@example.com";
	        when(customerRepository.findByEmail(email)).thenReturn(Optional.empty());

	        // Act
	        Optional<CustomerEntity> result = customerRepository.findByEmail(email);

	        // Assert
	        assertFalse(result.isPresent());
	        verify(customerRepository, times(1)).findByEmail(email);
	    }
	}
