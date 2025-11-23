package com.databases.hm.costco;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataController {

    @GetMapping("/")
    public String hello() {
        return "I work, hello world!";
    }
}
