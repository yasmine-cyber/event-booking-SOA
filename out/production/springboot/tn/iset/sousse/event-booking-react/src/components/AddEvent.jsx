import React, { useState } from "react";
import { addEvent } from "../api/apiContext";

function AddEvent({ onAdded }) {
    const [event, setEvent] = useState({
        titre: "",
        description: "",
        date: "",
        lieu: "",
        placesDisponibles: 10,
    });

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple date formatting if needed, or rely on input type="datetime-local"
        addEvent(event)
            .then(() => {
                onAdded();
                setEvent({
                    titre: "",
                    description: "",
                    date: "",
                    lieu: "",
                    placesDisponibles: 10,
                });
            })
            .catch((err) => console.error(err));
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <h3>Ajouter un Événement</h3>
            <input
                type="text"
                name="titre"
                placeholder="Titre"
                value={event.titre}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={event.description}
                onChange={handleChange}
            />
            <input
                type="datetime-local"
                name="date"
                value={event.date}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lieu"
                placeholder="Lieu"
                value={event.lieu}
                onChange={handleChange}
            />
            <input
                type="number"
                name="placesDisponibles"
                placeholder="Places"
                value={event.placesDisponibles}
                onChange={handleChange}
            />
            <button type="submit">Enregistrer</button>
        </form>
    );
}

export default AddEvent;
