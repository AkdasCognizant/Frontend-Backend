package com.ofds.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ofds.exception.NoDataFoundException;
import com.ofds.exception.RecordAlreadyFoundException;

@RestControllerAdvice
public class GobalExceptionHandler {

    @ExceptionHandler(RecordAlreadyFoundException.class)
    public ResponseEntity<String> handleRecordAlreadyFound(RecordAlreadyFoundException ex)
    {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT); // 409
    }
    
    @ExceptionHandler(NoDataFoundException.class)
    public ResponseEntity<String> handleNoDataFound(NoDataFoundException ex) 
    {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND); // 404
    }

}
