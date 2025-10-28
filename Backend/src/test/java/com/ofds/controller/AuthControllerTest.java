
package com.ofds.controller;

import com.ofds.config.JwtUtils;
import com.ofds.dto.AuthRequest;
import com.ofds.entity.CustomerEntity;
import com.ofds.repository.CustomerRepository;
import com.ofds.service.CustomerService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private CustomerRepository custRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CustomerService customerService;

    @Test
    void testLoginReturnsTokenAndUser() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        CustomerEntity mockUser = new CustomerEntity();
        mockUser.setEmail("test@example.com");

        when(authManager.authenticate(any())).thenReturn(mock(Authentication.class));
        when(jwtUtils.generateToken("test@example.com")).thenReturn("mock-token");
        when(custRepo.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        ResponseEntity<Map<String, Object>> loginResponse = authController.login(request);

        assertEquals(200, loginResponse.getStatusCodeValue());
        assertEquals("mock-token", loginResponse.getBody().get("token"));
        assertEquals(mockUser, loginResponse.getBody().get("user"));
    }

    @Test
    void testRegisterSuccess() {
        AuthRequest request = new AuthRequest();
        request.setEmail("new@example.com");
        request.setPassword("pass123");
        request.setName("New User");
        request.setPhone("1234567890");

        when(custRepo.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("encodedPass123");

        ResponseEntity<String> registerResponse = authController.register(request);

        assertEquals(200, registerResponse.getStatusCodeValue());
        assertEquals("User registered successfully", registerResponse.getBody());
    }

    @Test
    void testRegisterFailsIfUserExists() {
        AuthRequest request = new AuthRequest();
        request.setEmail("existing@example.com");
        request.setPassword("pass123");

        when(custRepo.findByEmail("existing@example.com")).thenReturn(Optional.of(new CustomerEntity()));

        ResponseEntity<String> registerResponse = authController.register(request);

        assertEquals(400, registerResponse.getStatusCodeValue());
        assertEquals("Username already exists", registerResponse.getBody());
    }

    @Test
    void testUpdateCustomerSuccessWithEmailChange() {
        String token = "Bearer mock-token";
        String currentEmail = "old@example.com";

        AuthRequest request = new AuthRequest();
        request.setEmail("new@example.com");
        request.setName("Updated Name");
        request.setPhone("9999999999");
        request.setPassword("newpass");

        CustomerEntity existingUser = new CustomerEntity();
        existingUser.setEmail(currentEmail);
        existingUser.setName("Old Name");
        existingUser.setPhone("8888888888");
        existingUser.setPassword("oldpass");

        when(jwtUtils.extractUsername("mock-token")).thenReturn(currentEmail);
        when(custRepo.findByEmail(currentEmail)).thenReturn(Optional.of(existingUser));
        when(custRepo.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("newpass")).thenReturn("encodedNewPass");

        ResponseEntity<String> response = authController.updateCustomer(token, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Email updated successfully. Please log in again with your new email.", response.getBody());
        verify(custRepo).save(existingUser);
    }

    @Test
    void testUpdateCustomerFailsIfEmailAlreadyExists() {
        String token = "Bearer mock-token";
        String currentEmail = "old@example.com";

        AuthRequest request = new AuthRequest();
        request.setEmail("existing@example.com");

        CustomerEntity existingUser = new CustomerEntity();
        existingUser.setEmail(currentEmail);

        when(jwtUtils.extractUsername("mock-token")).thenReturn(currentEmail);
        when(custRepo.findByEmail(currentEmail)).thenReturn(Optional.of(existingUser));
        when(custRepo.findByEmail("existing@example.com")).thenReturn(Optional.of(new CustomerEntity()));

        ResponseEntity<String> response = authController.updateCustomer(token, request);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Email already in use", response.getBody());
        verify(custRepo, never()).save(any());
    }

    @Test
    void testUpdateCustomerFailsIfUserNotFound() {
        String token = "Bearer mock-token";

        when(jwtUtils.extractUsername("mock-token")).thenReturn("missing@example.com");
        when(custRepo.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        AuthRequest request = new AuthRequest();
        ResponseEntity<String> response = authController.updateCustomer(token, request);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }
}
