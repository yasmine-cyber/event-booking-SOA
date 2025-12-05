import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============= EVENTS ENDPOINTS =============
export const getEvents = () => api.get("/api/evenements");
export const getActiveEvents = () => api.get("/api/evenements/actifs");
export const getEventById = (id) => api.get(`/api/evenements/${id}`);
export const createEvent = (event) => api.post("/api/evenements", event);
export const updateEvent = (id, event) => api.put(`/api/evenements/${id}`, event);
export const deleteEvent = (id) => api.delete(`/api/evenements/${id}`);
export const deactivateEvent = (id) => api.patch(`/api/evenements/${id}/desactiver`);
export const activateEvent = (id) => api.patch(`/api/evenements/${id}/activer`);
export const searchEventsByLocation = (lieu) => api.get(`/api/evenements/search/lieu?lieu=${lieu}`);
export const searchEventsByTitle = (titre) => api.get(`/api/evenements/search/titre?titre=${titre}`);

// ============= RESERVATIONS ENDPOINTS =============
export const getReservations = () => api.get("/api/reservations");
export const getReservationById = (id) => api.get(`/api/reservations/${id}`);
export const getUserReservations = (userId) => api.get(`/api/reservations/utilisateur/${userId}`);
export const getEventReservations = (eventId) => api.get(`/api/reservations/evenement/${eventId}`);
export const createReservation = (reservation) => api.post("/api/reservations", reservation);
export const deleteReservation = (id) => api.delete(`/api/reservations/${id}`);
export const getReservationStats = (eventId) => api.get(`/api/reservations/evenement/${eventId}/stats`);

// ============= USERS ENDPOINTS =============
export const getAllUsers = () => api.get("/api/utilisateurs");
export const getUserById = (id) => api.get(`/api/utilisateurs/${id}`);
export const getUserByEmail = (email) => api.get(`/api/utilisateurs/email/${email}`);
export const registerParticipant = (participant) => api.post("/api/utilisateurs/inscription/participant", participant);
export const registerOrganizer = (organizer) => api.post("/api/utilisateurs/inscription/organisateur", organizer);
export const login = (credentials) => api.post("/api/utilisateurs/connexion", credentials);
export const updateUser = (id, user) => api.put(`/api/utilisateurs/${id}`, user);
export const deleteUser = (id) => api.delete(`/api/utilisateurs/${id}`);

// ============= FACT ENDPOINT =============
export const getFact = () => api.get("/api/fact");

// ============= EXTERNAL SERVICES ENDPOINTS =============
export const getWeather = (city) => api.get(`/api/external/weather/${city}`);
export const getCountryInfo = (countryName) => api.get(`/api/external/country/${countryName}`);

// ============= ERROR HANDLING =============
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || error.response.statusText || "An error occurred";
  }
  return error.message || "Network error";
};
