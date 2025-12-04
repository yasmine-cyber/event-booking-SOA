import React, { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import ReservationForm from "./components/ReservationForm";
import UserReservations from "./components/UserReservations";
import CreateEvent from "./components/CreateEvent";
import ManageEvents from "./components/ManageEvents";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const { user, isLoading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedEventForReservation, setSelectedEventForReservation] = useState(null);
  const [refreshEvents, setRefreshEvents] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  if (isLoading) {
    return (
      <div className="loading-app">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowEventDetail(false);
  };

  const handleAuthClick = (authMode) => {
    setAuthMode(authMode);
    setCurrentPage("auth");
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvent(eventId);
    setShowEventDetail(true);
  };

  const handleReserveEvent = (event) => {
    if (!user) {
      setAuthMode("login");
      setCurrentPage("auth");
      return;
    }
    setSelectedEventForReservation(event);
    setShowReservationForm(true);
  };

  const handleReservationCreated = () => {
    setRefreshEvents(!refreshEvents);
  };

  const handleLoginSuccess = () => {
    setCurrentPage("events");
    setAuthMode("login");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("events");
    setAuthMode("login");
  };

  const renderContent = () => {
    // Auth pages - shown regardless of login state
    if (currentPage === "auth") {
      if (authMode === "login") {
        return (
          <Login
            onSwitchToRegister={() => setAuthMode("register")}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      } else {
        return (
          <Register
            onSwitchToLogin={() => setAuthMode("login")}
            onRegisterSuccess={handleRegisterSuccess}
          />
        );
      }
    }

    // Protected pages - require login
    if (!user && currentPage !== "events") {
      setAuthMode("login");
      setCurrentPage("auth");
      return (
        <Login
          onSwitchToRegister={() => setAuthMode("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    switch (currentPage) {
      case "events":
        return (
          <>
            <EventList
              refresh={refreshEvents}
              onSelectEvent={handleSelectEvent}
              onReserve={handleReserveEvent}
            />
            {showEventDetail && selectedEvent && (
              <EventDetail
                eventId={selectedEvent}
                onClose={() => setShowEventDetail(false)}
                onReserve={handleReserveEvent}
              />
            )}
          </>
        );

      case "my-reservations":
        return <UserReservations />;

      case "create-event":
        return user?.userType === "organisateur" ? (
          <CreateEvent
            onEventCreated={() => {
              setRefreshEvents(!refreshEvents);
              setCurrentPage("manage-events");
            }}
            onClose={() => setCurrentPage("events")}
          />
        ) : (
          <div className="unauthorized">
            <p>Only organizers can create events.</p>
          </div>
        );

      case "manage-events":
        return user?.userType === "organisateur" ? (
          <ManageEvents />
        ) : (
          <div className="unauthorized">
            <p>Only organizers can manage events.</p>
          </div>
        );

      default:
        return (
          <EventList
            refresh={refreshEvents}
            onSelectEvent={handleSelectEvent}
            onReserve={handleReserveEvent}
          />
        );
    }
  };

  return (
    <div className="App">
      <Header onAuthClick={handleAuthClick} />
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="main-content">
        {renderContent()}
      </main>

      {showReservationForm && selectedEventForReservation && (
        <ReservationForm
          event={selectedEventForReservation}
          onClose={() => {
            setShowReservationForm(false);
            setSelectedEventForReservation(null);
          }}
          onReservationCreated={handleReservationCreated}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
