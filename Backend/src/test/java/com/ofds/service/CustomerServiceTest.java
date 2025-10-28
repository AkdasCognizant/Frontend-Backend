package com.ofds.service;

import com.ofds.dto.CustomerDTO;
import com.ofds.entity.CustomerEntity;
import com.ofds.exception.NoDataFoundException;
import com.ofds.exception.RecordAlreadyFoundException;
import com.ofds.repository.CustomerRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void testGetCustomerDataSuccess() throws NoDataFoundException {
        CustomerEntity entity1 = new CustomerEntity();
        entity1.setName("John");
        entity1.setEmail("john@example.com");

        CustomerEntity entity2 = new CustomerEntity();
        entity2.setName("Jane");
        entity2.setEmail("jane@example.com");

        List<CustomerEntity> entityList = Arrays.asList(entity1, entity2);

        CustomerDTO dto1 = new CustomerDTO();
        dto1.setName("John");
        dto1.setEmail("john@example.com");

        CustomerDTO dto2 = new CustomerDTO();
        dto2.setName("Jane");
        dto2.setEmail("jane@example.com");

        when(customerRepository.findAll()).thenReturn(entityList);
        when(modelMapper.map(entity1, CustomerDTO.class)).thenReturn(dto1);
        when(modelMapper.map(entity2, CustomerDTO.class)).thenReturn(dto2);

        ResponseEntity<List<CustomerDTO>> response = customerService.getCustomerData();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void testGetCustomerDataThrowsException() {
        when(customerRepository.findAll()).thenReturn(List.of());

        assertThrows(NoDataFoundException.class, () -> {
            customerService.getCustomerData();
        });

        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void testInsertCustomerDataSuccess() throws RecordAlreadyFoundException {
        CustomerDTO dto = new CustomerDTO();
        dto.setName("Akdas");
        dto.setEmail("akdas@example.com");
        dto.setPassword("securePass");

        CustomerEntity entity = new CustomerEntity();
        entity.setName("Akdas");
        entity.setEmail("akdas@example.com");
        entity.setPassword("securePass");

        when(customerRepository.findByEmail("akdas@example.com")).thenReturn(Optional.empty());
        when(modelMapper.map(dto, CustomerEntity.class)).thenReturn(entity);
        when(customerRepository.save(entity)).thenReturn(entity);
        when(modelMapper.map(entity, CustomerDTO.class)).thenReturn(dto);

        ResponseEntity<CustomerDTO> response = customerService.insertCustomerData(dto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("Akdas", response.getBody().getName());
        verify(customerRepository, times(1)).findByEmail("akdas@example.com");
        verify(customerRepository, times(1)).save(entity);
    }

    @Test
    void testInsertCustomerDataThrowsException() {
        CustomerDTO dto = new CustomerDTO();
        dto.setEmail("existing@example.com");

        CustomerEntity existing = new CustomerEntity();
        existing.setEmail("existing@example.com");

        when(customerRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(existing));

        assertThrows(RecordAlreadyFoundException.class, () -> {
            customerService.insertCustomerData(dto);
        });

        verify(customerRepository, times(1)).findByEmail("existing@example.com");
        verify(customerRepository, never()).save(any());
    }
}
