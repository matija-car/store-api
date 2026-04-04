package com.store.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@Tag(name = "Home", description = "Home endpoints")
public class HomeController {

    @GetMapping("")
    @Operation(summary = "Get API info", description = "Returns basic API information")
    public ApiInfo index() {
        return new ApiInfo(
                "Store API",
                "1.0.1",
                "Online Store REST API",
                "http://localhost:8080/api/swagger-ui.html"
        );
    }

    record ApiInfo(String name, String version, String description, String swaggerUrl) {}
}