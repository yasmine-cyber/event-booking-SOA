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

  useEffect(() => {
    loadEvent();
    fetchFact();
  }, [eventId]);

  const loadEvent = () => {
    setLoading(true);
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
        // Assuming the API returns an object with a 'fact' property or similar,
        // or just the text. Adjusting based on likely response.
        // If it returns { fact: "some text", length: 10 }, we want res.data.fact
        setFact(res.data.fact || res.data.text || res.data);
      })
      .catch((err) => console.error("Error loading fact:", err));
  };

  const fetchWeatherAndCountry = (city) => {
    getWeather(city)
      .then((res) => {
        setWeather(res.data);
        if (res.data.sys && res.data.sys.country) {
          const countryCode = res.data.sys.country;
          const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
          getCountryInfo(countryName)
            .then((countryRes) => setCountry(countryRes.data[0]))
            .catch((err) => console.error("Error loading country:", err));
        }
      })
      .catch((err) => console.error("Error loading weather:", err));
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
                      {weather.weather && weather.weather[0] ? (
                        <img
                          src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                          alt="Weather"
                        />
                      ) : (
                        <span>🌤️</span>
                      )}
                    </div>
                    <div className="service-info">
                      <h4>Weather</h4>
                      <p className="main-info">
                        {Math.round(weather.main.temp)}°C, {weather.weather[0].description}
                      </p>
                      <p className="sub-info">
                        Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
                      </p>
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
                {country ? (
                  <div className="service-card country">
                    <div className="service-icon">🌍</div>
                    <div className="service-info">
                      <h4>{country.name.common}</h4>
                      <p className="sub-info"><strong>Capital:</strong> {country.capital ? country.capital[0] : "N/A"}</p>
                      <p className="sub-info"><strong>Population:</strong> {country.population.toLocaleString()}</p>
                      <p className="sub-info">
                        <strong>Currency:</strong>{" "}
                        {country.currencies
                          ? Object.values(country.currencies)
                            .map((c) => `${c.name} (${c.symbol})`)
                            .join(", ")
                          : "N/A"}
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
          {/* End of detail-grid */}

          <div className="availability-bar">
            <div className="availability-label">
              Availability: <strong>{event.placesDisponibles}</strong> of <strong>?</strong> spots left
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
        {/* End of event-detail-body */}

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
