package tn.iset.sousse.eventbooking.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FactService {

    private final String API_URL = "https://catfact.ninja/fact";
    private final RestTemplate restTemplate = new RestTemplate();

    public String getRandomFact() {
        try {
            Map<String, Object> response = restTemplate.getForObject(API_URL, Map.class);
            if (response != null && response.containsKey("fact")) {
                return (String) response.get("fact");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Could not fetch a fact at this time.";
    }
}
