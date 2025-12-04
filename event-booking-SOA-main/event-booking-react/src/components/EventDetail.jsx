import React, { useState, useEffect } from "react";
import { getEventById } from "../api/apiContext";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/EventDetail.css";

function EventDetail({ eventId, onClose, onReserve }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = () => {
    setLoading(true);
    getEventById(eventId)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error loading event:", err))
      .finally(() => setLoading(false));
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

            <div className="detail-item">
              <span className="icon">👥</span>
              <div>
                <strong>Available Spots</strong>
                <p>{event.placesDisponibles} places</p>
              </div>
            </div>

            {event.organisateur && (
              <div className="detail-item">
                <span className="icon">👤</span>
                <div>
                  <strong>Organizer</strong>
                  <p>{event.organisateur.nom}</p>
                  <p style={{ fontSize: "0.9em", color: "#7f8c8d" }}>
                    {event.organisateur.email}
                  </p>
                </div>
              </div>
            )}
          </div>

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
