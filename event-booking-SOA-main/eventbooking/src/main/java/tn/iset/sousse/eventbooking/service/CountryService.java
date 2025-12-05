package tn.iset.sousse.eventbooking.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class CountryService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CountryService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<Map<String, Object>> getCountryInfo(String countryName) {
        System.out.println("=== COUNTRY SERVICE CALLED ===");
        System.out.println("Country name: " + countryName);

        try {
            // Try the new v3.1 API first
            String url = "https://restcountries.com/v3.1/name/" + countryName;
            System.out.println("Calling URL: " + url);

            String response = restTemplate.getForObject(url, String.class);
            System.out.println("Raw response: "
                    + (response != null ? response.substring(0, Math.min(200, response.length())) : "NULL"));

            if (response != null && !response.trim().isEmpty()) {
                List<Map<String, Object>> countries = objectMapper.readValue(response, List.class);
                System.out.println("Parsed " + countries.size() + " countries");

                // Return simplified data
                return simplifyCountryData(countries);
            } else {
                System.out.println("Empty response, trying v2 API...");
                return tryV2Api(countryName);
            }

        } catch (Exception e) {
            System.err.println("ERROR in CountryService: " + e.getMessage());
            e.printStackTrace();

            // Return mock data for testing
            return getMockCountryData(countryName);
        }
    }

    private List<Map<String, Object>> tryV2Api(String countryName) {
        try {
            String url = "https://restcountries.com/v2/name/" + countryName;
            System.out.println("Trying v2 URL: " + url);

            String response = restTemplate.getForObject(url, String.class);
            if (response != null && !response.trim().isEmpty()) {
                List<Map<String, Object>> countries = objectMapper.readValue(response, List.class);
                return simplifyV2Data(countries);
            }
        } catch (Exception e) {
            System.err.println("V2 API also failed: " + e.getMessage());
        }
        return getMockCountryData(countryName);
    }

    private List<Map<String, Object>> simplifyCountryData(List<Map<String, Object>> countries) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> country : countries) {
            Map<String, Object> simple = new HashMap<>();

            // Name
            if (country.get("name") instanceof Map) {
                Map<String, Object> name = (Map<String, Object>) country.get("name");
                simple.put("name", name.get("common"));
                simple.put("officialName", name.get("official"));
            }

            // Capital
            if (country.get("capital") instanceof List) {
                List<String> capitals = (List<String>) country.get("capital");
                simple.put("capital", capitals.isEmpty() ? "N/A" : capitals.get(0));
            }

            // Basic info
            simple.put("region", country.getOrDefault("region", "N/A"));
            simple.put("population", country.getOrDefault("population", 0));

            // Flag
            if (country.get("flags") instanceof Map) {
                Map<String, Object> flags = (Map<String, Object>) country.get("flags");
                simple.put("flag", flags.get("png"));
            }

            // Currencies
            if (country.get("currencies") instanceof Map) {
                Map<String, Object> currencies = (Map<String, Object>) country.get("currencies");
                if (!currencies.isEmpty()) {
                    Map<String, Object> firstCurrency = (Map<String, Object>) currencies.values().iterator().next();
                    simple.put("currency", firstCurrency.get("name"));
                }
            }

            result.add(simple);
        }

        System.out.println("Simplified data: " + result);
        return result;
    }

    private List<Map<String, Object>> simplifyV2Data(List<Map<String, Object>> countries) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> country : countries) {
            Map<String, Object> simple = new HashMap<>();
            simple.put("name", country.get("name"));
            simple.put("capital", country.getOrDefault("capital", "N/A"));
            simple.put("region", country.getOrDefault("region", "N/A"));
            simple.put("population", country.getOrDefault("population", 0));

            if (country.get("flags") instanceof Map) {
                Map<String, Object> flags = (Map<String, Object>) country.get("flags");
                simple.put("flag", flags.get("png"));
            }

            result.add(simple);
        }

        return result;
    }

    private List<Map<String, Object>> getMockCountryData(String countryName) {
        System.out.println("Returning mock data for: " + countryName);

        Map<String, Object> mockCountry = new HashMap<>();
        mockCountry.put("name", countryName);
        mockCountry.put("officialName", "Republic of " + countryName);
        mockCountry.put("capital", "Capital City");
        mockCountry.put("region", "Mock Region");
        mockCountry.put("population", 10000000);
        mockCountry.put("area", 500000);
        mockCountry.put("flag", "https://flagcdn.com/w320/us.png");
        mockCountry.put("currency", "Mock Currency");
        mockCountry.put("languages", Map.of("eng", "English"));
        mockCountry.put("timezones", List.of("UTC"));
        mockCountry.put("isMock", true);

        return List.of(mockCountry);
    }
}