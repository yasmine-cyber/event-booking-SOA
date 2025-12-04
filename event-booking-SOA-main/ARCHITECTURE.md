# EventHub Frontend Architecture & Flow Diagram

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   EVENTHUB FRONTEND                         │
│                   (React + Vite)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌───▼────┐ ┌────▼─────┐
         │  Contexts   │ │  API   │ │ Components│
         └─────────────┘ └────────┘ └───────────┘
              │               │           │
              │               │           │
         AuthContext    apiContext.js   16 Components
         (User State)   (40+ Endpoints)
```

---

## 🔄 User Flow Diagram

```
START
  │
  ├─► ANONYMOUS USER
  │   ├─► Browse Events (EventList)
  │   ├─► View Event Details (EventDetail)
  │   └─► Click Reserve → Redirect to Login
  │
  ├─► LOGIN/REGISTER (Authentication)
  │   ├─► Select User Type (Participant/Organizer)
  │   ├─► Fill Registration Form
  │   ├─► Submit to Backend
  │   └─► Store in localStorage + Navigate to Events
  │
  ├─► PARTICIPANT FLOW
  │   ├─► Browse Events (EventList + Search + Filter)
  │   ├─► View Event Details (EventDetail Modal)
  │   ├─► Make Reservation (ReservationForm Modal)
  │   │   ├─► Submit to API
  │   │   ├─► Show Success Toast
  │   │   └─► Update Events List
  │   │
  │   ├─► My Reservations (UserReservations Table)
  │   │   ├─► View all bookings
  │   │   ├─► Cancel reservation
  │   │   └─► Show confirmation
  │   │
  │   └─► Logout
  │
  ├─► ORGANIZER FLOW
  │   ├─► Create Event (CreateEvent Modal)
  │   │   ├─► Fill event details
  │   │   ├─► Submit to API
  │   │   └─► Navigate to Manage Events
  │   │
  │   ├─► Manage Events (ManageEvents Dashboard)
  │   │   ├─► View created events
  │   │   ├─► Filter by Active/Inactive
  │   │   ├─► Activate/Deactivate event
  │   │   └─► Delete event
  │   │
  │   └─► Logout
  │
  └─► END
```

---

## 🗂️ Component Hierarchy

```
App.jsx (Main Router)
│
├─► Header
│   └─► User Info / Logout
│
├─► Navigation
│   ├─► Browse Events
│   ├─► My Reservations
│   ├─► Create Event
│   └─► Manage Events
│
├─► Main Content (Based on Page)
│   │
│   ├─► Events Page
│   │   ├─► SearchBar
│   │   ├─► EventList
│   │   │   └─► EventCard[] (Grid)
│   │   │       ├─► EventDetail Modal
│   │   │       └─► ReservationForm Modal
│   │   └─► Toast
│   │
│   ├─► My Reservations Page
│   │   ├─► UserReservations Table
│   │   └─► Toast
│   │
│   ├─► Create Event Page
│   │   ├─► CreateEvent Modal
│   │   └─► Toast
│   │
│   ├─► Manage Events Page
│   │   ├─► ManageEvents Dashboard
│   │   │   └─► EventCard[] with Management Actions
│   │   └─► Toast
│   │
│   ├─► Login Page
│   │   ├─► Login Component
│   │   └─► Toast
│   │
│   └─► Register Page
│       ├─► Register Component
│       └─► Toast
│
└─► Footer
    └─► Fun Fact Display
```

---

## 📡 API Flow Diagram

```
FRONTEND (React)
     │
     ├──► HTTP GET /api/evenements
     │    └──► Backend
     │         └──► Database
     │              └──► Response (All Events)
     │                   └──► Frontend (EventList)
     │
     ├──► HTTP POST /api/reservations
     │    ├─► Payload: { utilisateur, evenement, nombreDePlaces }
     │    └──► Backend
     │         └──► Database
     │              └──► Response (Confirmation)
     │                   └──► Frontend (Toast + Update List)
     │
     ├──► HTTP POST /api/utilisateurs/connexion
     │    ├─► Payload: { email, motDePasse }
     │    └──► Backend
     │         └──► Database
     │              └──► Response (User Object)
     │                   └──► Frontend (localStorage + AuthContext)
     │
     └──► HTTP PUT /api/evenements/{id}
          ├─► Payload: { titre, description, ... }
          └──► Backend
               └──► Database
                    └──► Response (Updated Event)
                         └──► Frontend (ManageEvents Update)
```

---

## 🎭 State Management

```
GLOBAL STATE (Context API)
│
├─► AuthContext
│   ├─► user
│   │   ├─► id
│   │   ├─► nom
│   │   ├─► email
│   │   └─► userType (participant/organisateur)
│   │
│   ├─► isLoading (boolean)
│   ├─► setUser (function)
│   └─► logout (function)
│
LOCAL STATE (Component)
│
├─► EventList
│   ├─► events (array)
│   ├─► filteredEvents (array)
│   ├─► searchQuery (string)
│   └─► sortBy (enum)
│
├─► CreateEvent
│   ├─► formData (object)
│   ├─► loading (boolean)
│   └─► toast (object)
│
├─► UserReservations
│   ├─► reservations (array)
│   ├─► loading (boolean)
│   └─► toast (object)
│
└─► [Other Components]
    └─► Component-specific state
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────┘

USER REGISTRATION
│
├─► User selects Participant/Organizer
│
├─► Fills form (nom, email, motDePasse)
│
├─► Submit to:
│   POST /api/utilisateurs/inscription/participant
│   POST /api/utilisateurs/inscription/organisateur
│
├─► Backend validates & creates user
│
├─► Response: { id, nom, email, userType, ... }
│
├─► Frontend:
│   ├─► Store in localStorage
│   ├─► Update AuthContext
│   └─► Navigate to Events
│
└─► USER LOGGED IN ✓

USER LOGIN
│
├─► User fills email & password
│
├─► Submit to:
│   POST /api/utilisateurs/connexion
│   { email, motDePasse }
│
├─► Backend validates credentials
│
├─► Response: { id, nom, email, userType, ... }
│
├─► Frontend:
│   ├─► Store in localStorage
│   ├─► Update AuthContext
│   └─► Navigate to Events
│
└─► USER LOGGED IN ✓

PROTECTED ROUTES
│
├─► Check AuthContext.user
│
├─► If not logged in:
│   └─► Redirect to Login
│
├─► If organizer-only page:
│   ├─► Check user.userType === 'organisateur'
│   ├─► If true: Show page
│   └─► If false: Show error message
│
└─► Access granted ✓
```

---

## 🎨 Design System

```
COLOR PALETTE
│
├─► Primary: #6366f1 (Indigo)
│   └─► Buttons, Links, Highlights
│
├─► Secondary: #8b5cf6 (Purple)
│   └─► Hover States, Gradients
│
├─► Success: #10b981 (Green)
│   └─► Success Messages, Green Buttons
│
├─► Danger: #ef4444 (Red)
│   └─► Error Messages, Delete Buttons
│
├─► Warning: #f59e0b (Amber)
│   └─► Warning Messages, Cautionary Alerts
│
├─► Info: #3b82f6 (Blue)
│   └─► Informational Messages
│
├─► Light BG: #f8fafc (Very Light)
│   └─► Page Background, Hover States
│
├─► Dark BG: #0f172a (Very Dark)
│   └─► Header/Footer Background
│
├─► Text Primary: #1e293b (Dark)
│   └─► Main Text
│
└─► Text Secondary: #64748b (Gray)
    └─► Secondary Text, Descriptions

TYPOGRAPHY
│
├─► H1: 2.5rem, Bold
├─► H2: 2rem, Bold
├─► H3: 1.5rem, Bold
├─► Body: 1rem, Regular (16px base)
└─► Small: 0.875rem

SPACING SCALE
│
├─► xs: 0.25rem (4px)
├─► sm: 0.5rem (8px)
├─► md: 1rem (16px)
├─► lg: 1.5rem (24px)
└─► xl: 2rem (32px)
```

---

## 📱 Responsive Breakpoints

```
MOBILE FIRST (< 768px)
│
├─► Single column layouts
├─► Full-width cards
├─► Hamburger menu
├─► Stack buttons vertically
└─► Larger touch targets

TABLET (768px - 1024px)
│
├─► 2-column grids
├─► Adjusted spacing
├─► Sidebar nav (if space)
└─► Balanced layouts

DESKTOP (> 1024px)
│
├─► Multi-column layouts
├─► Full horizontal nav
├─► 3-4 column grids
└─► Optimized spacing
```

---

## 🔄 Event Management Flow

```
ORGANIZER: CREATE EVENT
│
├─► Navigate to "Create Event"
├─► CreateEvent Modal Opens
├─► Fill form:
│   ├─► Titre *
│   ├─► Description
│   ├─► Date & Time *
│   ├─► Location *
│   └─► Available Spots
├─► Submit form
├─► API POST /api/evenements
├─► Backend validates & creates
├─► Response: New Event Object
├─► Frontend:
│   ├─► Show success toast
│   ├─► Close modal
│   └─► Navigate to Manage Events
└─► Event created ✓

ORGANIZER: MANAGE EVENTS
│
├─► Navigate to "Manage Events"
├─► ManageEvents Dashboard loads
├─► Display all user's events
├─► Options per event:
│   ├─► Activate/Deactivate
│   │   └─► PATCH /api/evenements/{id}/activer|desactiver
│   │
│   ├─► Delete
│   │   ├─► Show confirmation
│   │   ├─► DELETE /api/evenements/{id}
│   │   └─► Refresh list
│   │
│   └─► View Details
│       └─► Show EventCard
│
└─► Events managed ✓

PARTICIPANT: MAKE RESERVATION
│
├─► Browse Events
├─► Click on event or "Reserve Now"
├─► EventDetail Modal/ReservationForm
├─► Select number of spots
├─► Submit reservation
├─► API POST /api/reservations
├─► Backend:
│   ├─► Validates spots available
│   ├─► Creates reservation
│   └─► Response: Confirmation
├─► Frontend:
│   ├─► Show success toast
│   ├─► Close modal
│   └─► Update available spots
└─► Reservation confirmed ✓
```

---

## 📊 Data Models

```
USER (Participant/Organizer)
├─► id (Long)
├─► nom (String)
├─► email (String)
├─► motDePasse (String)
├─► userType (String: participant/organisateur)
└─► approuve (Boolean) [organizer only]

EVENT (Evenement)
├─► id (Long)
├─► titre (String)
├─► description (String)
├─► date (LocalDateTime)
├─► lieu (String)
├─► placesDisponibles (Integer)
├─► actif (Boolean)
└─► organisateur (User ref)

RESERVATION
├─► id (Long)
├─► utilisateur (User ref)
├─► evenement (Event ref)
├─► nombreDePlaces (Integer)
└─► dateReservation (LocalDateTime)
```

---

## 🚀 Deployment Flow

```
DEVELOPMENT
│
├─► npm install
├─► npm run dev
└─► http://localhost:5173

BUILD FOR PRODUCTION
│
├─► npm run build
│   └─► Creates /dist folder
│
├─► Files optimized:
│   ├─► JavaScript minified
│   ├─► CSS bundled
│   └─► Assets compressed
│
└─► Ready for deployment

DEPLOYMENT OPTIONS
│
├─► Netlify (Recommended)
├─► Vercel
├─► GitHub Pages
├─► Docker
└─► Traditional hosting
```

---

**This architecture provides a scalable, maintainable, and professional event booking application!**
