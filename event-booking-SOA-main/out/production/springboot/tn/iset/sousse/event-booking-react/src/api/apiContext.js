import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEvents = () => api.get("/events");
export const addEvent = (event) => api.post("/events", event);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getFact = () => api.get("/fact");
