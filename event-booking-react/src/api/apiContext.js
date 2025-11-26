import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEvents = () => api.get("/api/evenements");
export const addEvent = (event) => api.post("/api/evenements", event);
export const deleteEvent = (id) => api.delete(`/api/evenements/${id}`);
export const getFact = () => api.get("/api/fact");
