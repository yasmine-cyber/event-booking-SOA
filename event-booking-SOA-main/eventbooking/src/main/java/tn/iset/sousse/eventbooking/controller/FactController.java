package tn.iset.sousse.eventbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.iset.sousse.eventbooking.service.FactService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FactController {

    private final FactService factService;

    public FactController(FactService factService) {
        this.factService = factService;
    }

    @GetMapping("/fact")
    public ResponseEntity<String> getRandomFact() {
        return ResponseEntity.ok(factService.getRandomFact());
    }
}