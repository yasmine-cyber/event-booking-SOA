import React, { useState, useContext } from "react";
import { createReservation } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import Toast from "./Toast";
import "../styles/ReservationForm.css";

function ReservationForm({ event, onClose, onReservationCreated }) {
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberOfSpots, setNumberOfSpots] = useState(1);

  if (!user) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Reservation">
        <div className="auth-required">
          <p>Please log in to make a reservation.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </Modal>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (numberOfSpots < 1 || numberOfSpots > event.placesDisponibles) {
      setToast({
        type: "error",
        message: `Please select between 1 and ${event.placesDisponibles} spots`,
      });
      return;
    }

    setLoading(true);
    try {
      const reservationData = {
        utilisateur: { id: user.id },
        evenement: { id: event.id },
        nombreDePlaces: numberOfSpots,
        dateReservation: new Date().toISOString(),
      };

      await createReservation(reservationData);
      setToast({ type: "success", message: "Reservation successful!" });
      setTimeout(() => {
        onReservationCreated();
        onClose();
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to create reservation. Please try again.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Reserve Event">
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="reservation-summary">
          <h3>{event.titre}</h3>
          <div className="summary-item">
            <span>Available Spots:</span>
            <strong>{event.placesDisponibles}</strong>
          </div>
          <div className="summary-item">
            <span>Location:</span>
            <strong>{event.lieu}</strong>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="numberOfSpots">Number of Spots *</label>
          <input
            type="number"
            id="numberOfSpots"
            min="1"
            max={event.placesDisponibles}
            value={numberOfSpots}
            onChange={(e) => setNumberOfSpots(parseInt(e.target.value))}
            required
          />
          <small>Maximum {event.placesDisponibles} spots available</small>
        </div>

        <div className="reservation-user-info">
          <h4>Reservation Details</h4>
          <p>
            <strong>Name:</strong> {user.nom}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Processing..." : "Confirm Reservation"}
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

export default ReservationForm;
