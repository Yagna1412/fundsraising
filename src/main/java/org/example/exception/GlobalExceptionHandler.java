package org.example.exception;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(
            RuntimeException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleRuntime(
            RuntimeException exception
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        error(
                                exception.getMessage()
                        )
                );

    }


    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleValidation(
            MethodArgumentNotValidException exception
    ) {

        Map<String, String> fields =
                new HashMap<>();


        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(

                        fieldError ->

                                fields.put(

                                        fieldError.getField(),

                                        fieldError
                                                .getDefaultMessage()

                                )

                );


        Map<String, Object> response =
                error(
                        "Validation failed"
                );


        response.put(
                "fields",
                fields
        );


        return ResponseEntity
                .badRequest()
                .body(response);

    }


    private Map<String, Object> error(
            String message
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();


        response.put(
                "timestamp",
                LocalDateTime.now()
        );


        response.put(
                "message",
                message
        );


        return response;

    }

}