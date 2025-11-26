import React, { useEffect, useState } from "react";
import { getEvents, deleteEvent, getFact } from "../api/apiContext";

function EventList({ refresh }) {
    const [events, setEvents] = useState([]);
    const [fact, setFact] = useState("");

    const loadEvents = () => {
        getEvents()
            .then((res) => setEvents(res.data))
            .catch((err) => console.error(err));
    };

    const loadFact = () => {
        getFact()
            .then((res) => setFact(res.data.fact))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadEvents();
        loadFact();
    }, [refresh]);

    const handleDelete = (id) => {
        deleteEvent(id).then(loadEvents);
    };

    return (
        <div>
            <h2>Liste des Événements</h2>
            <table border="1" width="100%" style={{ marginBottom: "20px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.titre}</td>
                            <td>{e.date}</td>
                            <td>{e.lieu}</td>
                            <td>
                                <button onClick={() => handleDelete(e.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ padding: "10px", border: "1px solid #ccc", background: "#f9f9f9" }}>
                <h3>Did you know?</h3>
                <p>{fact || "Loading fact..."}</p>
            </div>
        </div>
    );
}

export default EventList;
