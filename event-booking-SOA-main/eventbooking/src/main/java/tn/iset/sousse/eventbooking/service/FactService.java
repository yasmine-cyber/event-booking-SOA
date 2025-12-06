package tn.iset.sousse.eventbooking.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

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
            String url = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

            // Set User-Agent to avoid 403 Forbidden and Accept header for JSON
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "EventBookingApp/1.0");
            headers.set("Accept", "application/json");
            
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("parameters", headers);

            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    String.class);

            String jsonResponse = responseEntity.getBody();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> response = mapper.readValue(jsonResponse, Map.class);

            if (response != null && response.containsKey("text")) {
                String fact = (String) response.get("text");
                logger.info("Successfully fetched fact: {}", fact.substring(0, Math.min(50, fact.length())) + "...");
                return fact;
            }

            logger.warn("No fact available in API response");
            return "No fact available.";

        } catch (Exception e) {
            logger.error("Fact API failed: {}", e.getMessage(), e);
            // Including error for debugging purposes
            return "Fun fact: Spring Boot is awesome! (Fallback: " + e.getMessage() + ")";
        }
    }
}