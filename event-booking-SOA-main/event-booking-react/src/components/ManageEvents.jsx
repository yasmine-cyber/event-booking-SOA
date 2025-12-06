import React, { useState, useEffect, useContext } from "react";
import { getEvents, deleteEvent, updateEvent, deactivateEvent, activateEvent } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import EventCard from "./EventCard";
import CreateEvent from "./CreateEvent";
import EventDetail from "./EventDetail";
import Toast from "./Toast";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/ManageEvents.css";

function ManageEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    getEvents()
      .then((res) => {
        // Filter events created by current user (organizer)
        const userEvents = res.data.filter(
          (e) => e.organisateur?.id === user?.id
        );
        setEvents(userEvents);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setToast({ type: "error", message: "Failed to load events" });
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setToast({ type: "success", message: "Event deleted successfully" });
      loadEvents();
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete event" });
      console.error(err);
    }
  };

  const handleToggleActive = async (event) => {
    try {
      if (event.actif) {
        await deactivateEvent(event.id);
        setToast({ type: "success", message: "Event deactivated" });
      } else {
        await activateEvent(event.id);
        setToast({ type: "success", message: "Event activated" });
      }
      loadEvents();
    } catch (err) {
      setToast({ type: "error", message: "Failed to update event" });
      console.error(err);
    }
  };

  const getFilteredEvents = () => {
    if (filterType === "active") {
      return events.filter((e) => e.actif);
    } else if (filterType === "inactive") {
      return events.filter((e) => !e.actif);
    }
    return events;
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-events-container">
      <div className="manage-header">
        <div>
          <h2>Manage Your Events</h2>
          <p>Create, edit, and manage your event listings</p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            setEditingEvent(null);
            setShowCreateModal(true);
          }}
        >
          + Create New Event
        </button>
      </div>

      <div className="manage-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All ({events.length})
          </button>
          <button
            className={`filter-btn ${filterType === "active" ? "active" : ""}`}
            onClick={() => setFilterType("active")}
          >
            Active ({events.filter((e) => e.actif).length})
          </button>
          <button
            className={`filter-btn ${filterType === "inactive" ? "active" : ""}`}
            onClick={() => setFilterType("inactive")}
          >
            Inactive ({events.filter((e) => !e.actif).length})
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events-message">
          <p>📭 No events found.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEvent(null);
              setShowCreateModal(true);
            }}
          >
            Create your first event
          </button>
        </div>
      ) : (
        <div className="events-management-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-management-card">
              <EventCard
                event={event}
                onViewDetails={(id) => setViewingEventId(id)}
                showActions={true}
                onEdit={() => {
                  setEditingEvent(event);
                  setShowCreateModal(true);
                }}
                onDelete={() => handleDeleteEvent(event.id)}
                customActions={
                  <button
                    className={`btn ${event.actif ? "btn-warning" : "btn-success"}`}
                    onClick={() => handleToggleActive(event)}
                  >
                    {event.actif ? "Deactivate" : "Activate"}
                  </button>
                }
              />
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEvent
          onEventCreated={loadEvents}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          existingEvent={editingEvent}
        />
      )}

      {viewingEventId && (
        <EventDetail
          eventId={viewingEventId}
          onClose={() => setViewingEventId(null)}
          onReserve={() => { }} // Organizers can't reserve their own events anyway
        />
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

export default ManageEvents;
