package com.ofds.controller;


import com.ofds.dto.CustomerDTO;
import com.ofds.exception.NoDataFoundException;
import com.ofds.exception.RecordAlreadyFoundException;
import com.ofds.service.CustomerService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

    @Mock
    private CustomerService custServiceObj;

    @InjectMocks
    private CustomerController customerController;

    @Test
    void testGetCustomerDataSuccess() throws NoDataFoundException {
    	CustomerDTO dto1 = new CustomerDTO("John", "john@example.com", "pass123", "1234567890", true);
    	CustomerDTO dto2 = new CustomerDTO("Jane", "jane@example.com", "pass456", "9876543210", true);

        List<CustomerDTO> mockList = Arrays.asList(dto1, dto2);

        when(custServiceObj.getCustomerData()).thenReturn(ResponseEntity.ok(mockList));

        ResponseEntity<List<CustomerDTO>> response = customerController.getCustomerData();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(custServiceObj, times(1)).getCustomerData();
    }

    @Test
    void testInsertCustomerDataSuccess() throws RecordAlreadyFoundException {
    	CustomerDTO input = new CustomerDTO("Akdas", "akdas@example.com", "securePass", "9988776655", true);
    	CustomerDTO saved = new CustomerDTO("Akdas", "akdas@example.com", "securePass", "9988776655", true);
    	
        when(custServiceObj.insertCustomerData(input)).thenReturn(ResponseEntity.ok(saved));

        ResponseEntity<CustomerDTO> response = customerController.insertCustomerData(input);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Akdas", response.getBody().getName());
        verify(custServiceObj, times(1)).insertCustomerData(input);
    }

    @Test
    void testHelloEndpoint() {
        String result = customerController.hello();
        assertEquals("Hello, you are an authenticated user..", result);
    }
}
