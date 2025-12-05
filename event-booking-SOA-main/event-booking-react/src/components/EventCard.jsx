import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // IMPORTANT: Ajouter cette ligne
import { getWeather } from "../api/apiContext";
import "../styles/EventCard.css";

function EventCard({ event, onViewDetails, onEdit, onDelete, onReserve, showActions = true }) {
  const { user } = useContext(AuthContext); // IMPORTANT: Ajouter cette ligne
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (event.lieu) {
      getWeather(event.lieu)
        .then((res) => setWeather(res.data))
        .catch((err) => console.error("Error fetching weather:", err));
    }
  }, [event.lieu]);

  const getAvailabilityColor = () => {
    if (event.placesDisponibles === 0) return "#e74c3c";
    if (event.placesDisponibles <= 5) return "#f39c12";
    return "#27ae60";
  };

  // Vérifier si l'utilisateur est un organisateur
  const isOrganizer = user && user.userType === "organisateur";
  // Vérifier si le bouton de réservation doit être désactivé
  const isReserveDisabled = isOrganizer || event.placesDisponibles === 0;

  return (
    <div className={`event-card ${!event.actif ? "inactive" : ""}`}>
      <div className="event-card-header">
        <div className="event-status">
          <span className={`status-badge ${event.actif ? "active" : "inactive"}`}>
            {event.actif ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.titre}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <div className="detail-item">
            <span className="icon">📅</span>
            <span className="text">{formatDate(event.date)}</span>
          </div>
          <div className="detail-item">
            <span className="icon">📍</span>
            <span className="text">{event.lieu}</span>
          </div>
          {weather && weather.main && (
            <div className="detail-item">
              <span className="icon">
                {weather.weather && weather.weather[0] ? (
                  <img
                    src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                    alt="Weather"
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : (
                  "🌤️"
                )}
              </span>
              <span className="text">{Math.round(weather.main.temp)}°C</span>
            </div>
          )}
          <div className="detail-item">
            <span className="icon">👥</span>
            <span
              className="text"
              style={{
                color: getAvailabilityColor(),
                fontWeight: "bold",
              }}
            >
              {event.placesDisponibles} places available
            </span>
          </div>
        </div>

        {event.organisateur && (
          <div className="organizer-info">
            <span>Organized by: <strong>{event.organisateur.nom}</strong></span>
          </div>
        )}
      </div>

      <div className="event-card-footer">
        {showActions && (
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => onViewDetails(event.id)}
            >
              View Details
            </button>
            {onReserve && (
              <button
                className="btn btn-success"
                onClick={() => onReserve(event)}
                disabled={isReserveDisabled}
                title={isOrganizer ? "Organizers cannot make reservations" : event.placesDisponibles === 0 ? "No places available" : ""}
              >
                {isOrganizer ? "Reserve (Disabled)" : "Reserve Now"}
              </button>
            )}
            {onEdit && (
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(event)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-danger"
                onClick={() => onDelete(event.id)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;