package tn.iset.sousse.eventbooking.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class CountryService {

    private final RestTemplate restTemplate;

    public CountryService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> getCountryInfo(String countryName) {
        try {
            String url = "https://restcountries.com/v2/name/" + countryName;
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

            if (response == null || response.isEmpty()) {
                return Collections.emptyList();
            }

            return response;

        } catch (Exception e) {
            System.err.println("Country API failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
