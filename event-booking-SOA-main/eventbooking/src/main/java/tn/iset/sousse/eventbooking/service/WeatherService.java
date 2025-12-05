package tn.iset.sousse.eventbooking.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getWeather(String city) {
        try {
            // 1. Geocoding
            String geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + city
                    + "&count=1&language=en&format=json";
            Map<String, Object> geoResponse = restTemplate.getForObject(geoUrl, Map.class);

            if (geoResponse == null || !geoResponse.containsKey("results")) {
                return null;
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) geoResponse.get("results");
            if (results == null || results.isEmpty())
                return null;

            Map<String, Object> location = results.get(0);
            Double lat = (Double) location.get("latitude");
            Double lon = (Double) location.get("longitude");

            // 2. Weather
            String weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon
                    + "&current_weather=true";
            Map<String, Object> weatherResponse = restTemplate.getForObject(weatherUrl, Map.class);

            if (weatherResponse == null || !weatherResponse.containsKey("current_weather"))
                return null;

            Map<String, Object> current = (Map<String, Object>) weatherResponse.get("current_weather");

            // 3. Map to OpenWeatherMap structure for frontend compatibility
            Map<String, Object> mapped = new HashMap<>();

            // main.temp
            Map<String, Object> main = new HashMap<>();
            main.put("temp", current.get("temperature"));
            main.put("humidity", 0); // Not available in simple current_weather
            mapped.put("main", main);

            // wind.speed
            Map<String, Object> wind = new HashMap<>();
            wind.put("speed", current.get("windspeed"));
            mapped.put("wind", wind);

            // weather[0].description/icon
            List<Map<String, Object>> weatherList = new ArrayList<>();
            Map<String, Object> wInfo = new HashMap<>();
            Integer code = (Integer) current.get("weathercode");
            wInfo.put("description", getWeatherDescription(code));
            wInfo.put("icon", "01d"); // Default icon
            weatherList.add(wInfo);
            mapped.put("weather", weatherList);

            return mapped;

        } catch (Exception e) {
            System.err.println("Error fetching weather for " + city + ": " + e.getMessage());
            return null;
        }
    }

    private String getWeatherDescription(Integer code) {
        if (code == null)
            return "Unknown";
        if (code == 0)
            return "Clear sky";
        if (code < 4)
            return "Partly cloudy";
        if (code < 50)
            return "Foggy";
        if (code < 60)
            return "Drizzle";
        if (code < 70)
            return "Rain";
        if (code < 80)
            return "Snow";
        if (code < 90)
            return "Showers";
        return "Thunderstorm";
    }
}
