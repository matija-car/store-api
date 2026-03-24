package com.store.controller;

import com.store.entity.Message;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/message")
@Tag(name = "Message", description = "Message endpoints")
public class MessageController {

    @GetMapping("")
    @Operation(summary = "Get greeting message", description = "Returns a greeting message")
    public ResponseEntity<Message> sayHello() {
        Message message = new Message("Hello! Welcome to Store API");
        return ResponseEntity.ok(message);
    }
}