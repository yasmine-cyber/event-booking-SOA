package tn.iset.sousse.eventbooking.controller;

import tn.iset.sousse.eventbooking.service.FactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class FactController {

    @Autowired
    private FactService factService;

    @GetMapping("/fact")
    public ResponseEntity<Map<String, String>> getRandomFact() {
        String fact = factService.getRandomFact();
        Map<String, String> response = new HashMap<>();
        response.put("fact", fact);
        return ResponseEntity.ok(response);
    }
}
