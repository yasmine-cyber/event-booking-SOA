import React, { useState, useEffect } from "react";
import { getActiveEvents } from "../api/apiContext";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/EventList.css";

function EventList({ refresh, onSelectEvent, onReserve }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadEvents();
  }, [refresh]);

  const loadEvents = () => {
    setLoading(true);
    getActiveEvents()
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    let filtered = events;

    if (query.trim()) {
      if (type === "title") {
        filtered = events.filter((e) =>
          e.titre.toLowerCase().includes(query.toLowerCase())
        );
      } else if (type === "location" || type === "country") {
        filtered = events.filter((e) =>
          e.lieu.toLowerCase().includes(query.toLowerCase())
        );
      }
    }

    setFilteredEvents(sortEvents(filtered, sortBy));
  };

  const sortEvents = (eventsToSort, sortType) => {
    const sorted = [...eventsToSort];
    switch (sortType) {
      case "date":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "title":
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case "availability":
        return sorted.sort((a, b) => b.placesDisponibles - a.placesDisponibles);
      default:
        return sorted;
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setFilteredEvents(sortEvents(filteredEvents, sortType));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Discover Events</h2>
        <p>Find and book your next amazing event</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="event-list-controls">
        <div className="sort-controls">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="availability">Availability</option>
          </select>
        </div>
        <div className="event-count">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onSelectEvent}
              onReserve={onReserve}
              showActions={true}
            />
          ))
        ) : (
          <div className="no-events">
            <p>📭 No events found. Try adjusting your search criteria or creating an event.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventList;
