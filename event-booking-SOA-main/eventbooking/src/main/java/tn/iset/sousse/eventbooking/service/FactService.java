package tn.iset.sousse.eventbooking.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class FactService {

    private static final Logger logger = LoggerFactory.getLogger(FactService.class);
    private final RestTemplate restTemplate;

    public FactService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        logger.info("FactService initialized with RestTemplate");
    }

    public String getRandomFact() {
        try {
            logger.info("Fetching random fact from API");
            String url = "https://uselessfacts.jsph.pl/random.json?language=en";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("text")) {
                String fact = (String) response.get("text");
                logger.info("Successfully fetched fact: {}", fact.substring(0, Math.min(50, fact.length())) + "...");
                return fact;
            }

            logger.warn("No fact available in API response");
            return "No fact available.";

        } catch (Exception e) {
            logger.error("Fact API failed: {}", e.getMessage(), e);
            return "Fun fact: Spring Boot is awesome! (Fallback)";
        }
    }

    // Add this simple test endpoint
    @GetMapping("/test-fact")
    public ResponseEntity<String> testFact() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Test endpoint is working!");
    }
}