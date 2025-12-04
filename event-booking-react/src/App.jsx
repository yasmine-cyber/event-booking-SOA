import React, { useState } from "react";
import EventList from "./components/EventList";
import AddEvent from "./components/AddEvent";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reload = () => setRefresh(!refresh);

  return (
    <div className="App">
      <h1>Event Booking Manager</h1>
      <AddEvent onAdded={reload} />
      <EventList refresh={refresh} />
    </div>
  );
}

export default App;
