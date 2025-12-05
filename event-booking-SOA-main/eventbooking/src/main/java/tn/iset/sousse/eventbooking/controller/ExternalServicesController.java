package tn.iset.sousse.eventbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.iset.sousse.eventbooking.service.CountryService;
import tn.iset.sousse.eventbooking.service.WeatherService;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/external")
@CrossOrigin(origins = "http://localhost:5173")
public class ExternalServicesController {

    private final WeatherService weatherService;
    private final CountryService countryService;

    public ExternalServicesController(
            WeatherService weatherService,
            CountryService countryService) {
        this.weatherService = weatherService;
        this.countryService = countryService;

    }

    @GetMapping("/weather/{city}")
    public ResponseEntity<Map<String, Object>> getWeather(@PathVariable String city) {
        return ResponseEntity.ok(weatherService.getWeather(city));
    }

    @GetMapping("/country/{countryName}")
    public ResponseEntity<List<Map<String, Object>>> getCountryInfo(@PathVariable String countryName) {
        return ResponseEntity.ok(countryService.getCountryInfo(countryName));
    }

}