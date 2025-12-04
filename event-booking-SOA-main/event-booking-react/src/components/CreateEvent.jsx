import React, { useState, useContext } from "react";
import { createEvent } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import Toast from "./Toast";
import "../styles/CreateEvent.css";

function CreateEvent({ onEventCreated, onClose }) {
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date: "",
    lieu: "",
    placesDisponibles: 10,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "placesDisponibles" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre || !formData.date || !formData.lieu) {
      setToast({ type: "error", message: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      // Add organizer if user is an organizer
      const eventData = {
        ...formData,
        actif: true,
        organisateur: user?.userType === "organisateur" ? { id: user.id } : null,
      };

      await createEvent(eventData);
      setToast({ type: "success", message: "Event created successfully!" });
      setFormData({
        titre: "",
        description: "",
        date: "",
        lieu: "",
        placesDisponibles: 10,
      });
      setTimeout(() => {
        onEventCreated();
        onClose();
      }, 1500);
    } catch (err) {
      setToast({ type: "error", message: "Failed to create event. Please try again." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Event">
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="titre">Event Title *</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleInputChange}
            placeholder="e.g., Summer Tech Conference"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your event..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date & Time *</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lieu">Location *</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formData.lieu}
              onChange={handleInputChange}
              placeholder="e.g., Convention Center, Room 101"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="placesDisponibles">Available Spots</label>
          <input
            type="number"
            id="placesDisponibles"
            name="placesDisponibles"
            value={formData.placesDisponibles}
            onChange={handleInputChange}
            min="1"
            max="1000"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Modal>
  );
}

export default CreateEvent;
