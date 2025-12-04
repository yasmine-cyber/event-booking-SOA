import React from "react";
import "../styles/EventCard.css";

function EventCard({ event, onViewDetails, onEdit, onDelete, onReserve, showActions = true }) {
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

  const getAvailabilityColor = () => {
    if (event.placesDisponibles === 0) return "#e74c3c";
    if (event.placesDisponibles <= 5) return "#f39c12";
    return "#27ae60";
  };

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
                disabled={event.placesDisponibles === 0}
              >
                Reserve Now
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
