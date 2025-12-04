import React, { useState, useEffect, useContext } from "react";
import { getUserReservations, deleteReservation } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";
import "../styles/UserReservations.css";

function UserReservations() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = () => {
    setLoading(true);
    getUserReservations(user.id)
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error("Error loading reservations:", err);
        setToast({ type: "error", message: "Failed to load reservations" });
      })
      .finally(() => setLoading(false));
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      await deleteReservation(reservationId);
      setToast({ type: "success", message: "Reservation cancelled successfully" });
      loadReservations();
    } catch (err) {
      setToast({ type: "error", message: "Failed to cancel reservation" });
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-reservations-container">
      <h2>My Reservations</h2>
      <p className="subtitle">View and manage your event bookings</p>

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>🎫 You haven't made any reservations yet.</p>
          <p>Browse events and book your first experience!</p>
        </div>
      ) : (
        <div className="reservations-table-wrapper">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Location</th>
                <th>Date</th>
                <th>Spots</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="reservation-row">
                  <td className="event-name">
                    <strong>{reservation.evenement?.titre || "Event"}</strong>
                  </td>
                  <td>{reservation.evenement?.lieu || "N/A"}</td>
                  <td>{formatDate(reservation.evenement?.date)}</td>
                  <td className="spots-badge">{reservation.nombreDePlaces}</td>
                  <td>{formatDate(reservation.dateReservation)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default UserReservations;
