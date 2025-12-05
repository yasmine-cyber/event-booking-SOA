import React, { useState, useEffect } from "react";
import { getEventById, getWeather, getCountryInfo, getFact } from "../api/apiContext";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/EventDetail.css";

function EventDetail({ eventId, onClose, onReserve }) {
  const [event, setEvent] = useState(null);
  const [weather, setWeather] = useState(null);
  const [country, setCountry] = useState(null);
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    loadEvent();
    fetchFact();
  }, [eventId]);

  const loadEvent = () => {
    setLoading(true);
    setCountry(null); // Reset country data
    getEventById(eventId)
      .then((res) => {
        setEvent(res.data);
        if (res.data.lieu) {
          fetchWeatherAndCountry(res.data.lieu);
        }
      })
      .catch((err) => console.error("Error loading event:", err))
      .finally(() => setLoading(false));
  };

  const fetchFact = () => {
    getFact()
      .then((res) => {
        // Handle different response formats
        if (res.data.fact) {
          setFact(res.data.fact);
        } else if (res.data.text) {
          setFact(res.data.text);
        } else if (typeof res.data === 'string') {
          setFact(res.data);
        } else {
          setFact("Fun fact: Technology makes our lives easier!");
        }
      })
      .catch((err) => {
        console.error("Error loading fact:", err);
        setFact("Did you know? The first computer bug was a real insect!");
      });
  };

  const fetchWeatherAndCountry = (location) => {
    // First, try to get weather for the location
    getWeather(location)
      .then((res) => {
        setWeather(res.data);

        // Now try to get country info
        // Method 1: Try to extract country from location string
        let countryName = extractCountryFromLocation(location);

        // Method 2: If weather API returns country code
        if (!countryName && res.data.sys && res.data.sys.country) {
          const countryCode = res.data.sys.country;
          try {
            // Convert country code to country name
            countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
          } catch (e) {
            console.log("Could not convert country code:", countryCode);
          }
        }

        // If we have a country name, fetch country info
        if (countryName) {
          fetchCountryInfo(countryName);
        } else {
          // Try with location itself as country
          fetchCountryInfo(location);
        }
      })
      .catch((err) => {
        console.error("Error loading weather:", err);
        // Even if weather fails, try to get country info from location
        fetchCountryInfo(location);
      });
  };

  const extractCountryFromLocation = (location) => {
    if (!location) return null;

    // Common country mappings
    const countryMappings = {
      'paris': 'france',
      'tunis': 'tunisia',
      'tunisia': 'tunisia',
      'tunisie': 'tunisia',
      'london': 'united kingdom',
      'berlin': 'germany',
      'rome': 'italy',
      'madrid': 'spain',
      'new york': 'united states',
      'tokyo': 'japan',
      'beijing': 'china',
      'moscow': 'russia',
      'cairo': 'egypt',
      'algiers': 'algeria',
      'rabat': 'morocco',
    };

    const locationLower = location.toLowerCase();

    // Check if location contains country names
    const countries = ['france', 'tunisia', 'germany', 'italy', 'spain', 'usa', 'united states', 'uk', 'united kingdom', 'china', 'japan'];

    for (const c of countries) {
      if (locationLower.includes(c)) {
        return c;
      }
    }

    // Check mappings for city names
    for (const [city, country] of Object.entries(countryMappings)) {
      if (locationLower.includes(city)) {
        return country;
      }
    }

    // Return the location itself as fallback
    return locationLower.split(',')[0].trim();
  };

  const fetchCountryInfo = (countryName) => {
    setCountryLoading(true);
    getCountryInfo(countryName)
      .then((countryRes) => {
        console.log("Country API response:", countryRes.data);

        if (countryRes.data && countryRes.data.length > 0) {
          // Handle both v3.1 and v2 API formats
          const countryData = countryRes.data[0];
          setCountry({
            name: countryData.name?.common || countryData.name || countryName,
            capital: Array.isArray(countryData.capital) ? countryData.capital[0] : countryData.capital,
            population: countryData.population || 0,
            region: countryData.region || "Unknown",
            flag: countryData.flags?.png || countryData.flag || null,
            currencies: countryData.currencies || {}
          });
        } else {
          // No country found
          setCountry({
            name: countryName,
            capital: "Unknown",
            population: 0,
            region: "Unknown",
            flag: null,
            currencies: {}
          });
        }
      })
      .catch((err) => {
        console.error("Error loading country:", err);
        // Set mock country data
        setCountry({
          name: countryName,
          capital: "Capital City",
          population: 10000000,
          region: "Region",
          flag: null,
          currencies: { USD: { name: "US Dollar", symbol: "$" } }
        });
      })
      .finally(() => {
        setCountryLoading(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="event-detail-error">Event not found</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency display
  const formatCurrencies = (currencies) => {
    if (!currencies || Object.keys(currencies).length === 0) return "N/A";

    return Object.values(currencies)
      .map(c => `${c.name} (${c.symbol || "N/A"})`)
      .join(", ");
  };

  return (
    <div className="event-detail-modal">
      <div className="event-detail-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="event-detail-header">
          <h2>{event.titre}</h2>
          <span className={`status-badge ${event.actif ? "active" : "inactive"}`}>
            {event.actif ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="event-detail-body">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="icon">📅</span>
              <div>
                <strong>Date & Time</strong>
                <p>{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>{event.lieu}</p>
              </div>
            </div>

            {/* Services Section */}
            <div className="services-section">
              <h3>Event Insights</h3>
              <div className="services-grid">
                {/* Weather Service */}
                {weather ? (
                  <div className="service-card weather">
                    <div className="service-icon">
                      {weather.weather && weather.weather[0] && weather.weather[0].icon ? (
                        <img
                          src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                          alt="Weather"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '🌤️';
                          }}
                        />
                      ) : (
                        <span>🌤️</span>
                      )}
                    </div>
                    <div className="service-info">
                      <h4>Weather</h4>
                      <p className="main-info">
                        {weather.main ? `${Math.round(weather.main.temp)}°C` : "N/A"}
                        {weather.weather && weather.weather[0] ? `, ${weather.weather[0].description}` : ""}
                      </p>
                      {weather.main && (
                        <p className="sub-info">
                          {weather.main.humidity !== undefined && `Humidity: ${weather.main.humidity}%`}
                          {weather.wind && weather.wind.speed && ` | Wind: ${weather.wind.speed} m/s`}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="service-card weather error">
                    <span className="service-icon">🌤️</span>
                    <div className="service-info">
                      <h4>Weather</h4>
                      <p>Weather data unavailable</p>
                    </div>
                  </div>
                )}

                {/* Country Service */}
                {countryLoading ? (
                  <div className="service-card country loading">
                    <span className="service-icon">🌍</span>
                    <div className="service-info">
                      <h4>Destination</h4>
                      <p>Loading country data...</p>
                    </div>
                  </div>
                ) : country ? (
                  <div className="service-card country">
                    <div className="service-icon">
                      {country.flag ? (
                        <img
                          src={country.flag}
                          alt={`Flag of ${country.name}`}
                          style={{ width: '40px', height: 'auto', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '🌍';
                          }}
                        />
                      ) : (
                        <span>🌍</span>
                      )}
                    </div>
                    <div className="service-info">
                      <h4>{country.name}</h4>
                      <p className="sub-info"><strong>Capital:</strong> {country.capital || "N/A"}</p>
                      <p className="sub-info"><strong>Population:</strong> {country.population.toLocaleString()}</p>
                      <p className="sub-info"><strong>Region:</strong> {country.region}</p>
                      <p className="sub-info">
                        <strong>Currency:</strong> {formatCurrencies(country.currencies)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="service-card country error">
                    <span className="service-icon">🌍</span>
                    <div className="service-info">
                      <h4>Destination</h4>
                      <p>Country data unavailable</p>
                    </div>
                  </div>
                )}

                {/* Fact Service */}
                <div className="service-card fact">
                  <div className="service-icon">💡</div>
                  <div className="service-info">
                    <h4>Did You Know?</h4>
                    {fact ? (
                      <p className="fact-text">"{fact}"</p>
                    ) : (
                      <p>Loading fun fact...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="availability-bar">
            <div className="availability-label">
              Availability: <strong>{event.placesDisponibles}</strong> spots left
            </div>
            <div className="availability-progress">
              <div
                className="availability-filled"
                style={{
                  width: `${Math.min((event.placesDisponibles / 100) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="event-detail-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {event.actif && event.placesDisponibles > 0 && (
            <button
              className="btn btn-success btn-lg"
              onClick={() => {
                onReserve(event);
                onClose();
              }}
            >
              Reserve Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;