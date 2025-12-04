# EventHub - Professional Event Booking Frontend

A comprehensive, modern React-based frontend for managing events, reservations, and user authentication. Built with professional UI/UX design patterns and fully responsive for all devices.

## 🎯 Features

### For All Users
- **Browse Events**: Discover active events with advanced filtering and search
- **Event Details**: View comprehensive event information with availability status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Toast notifications for all user actions

### For Participants
- **User Authentication**: Secure login and registration system
- **Make Reservations**: Book spots for events with ease
- **Manage Reservations**: View and cancel your bookings
- **Search & Filter**: Find events by title, location, date, or availability

### For Organizers
- **Create Events**: Add new events with detailed information
- **Manage Events**: Edit, activate, deactivate, or delete events
- **Event Statistics**: View reservation statistics for each event
- **Dashboard**: Comprehensive event management interface

## 📋 Project Structure

```
src/
├── components/              # React components
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   ├── EventList.jsx
│   ├── EventCard.jsx
│   ├── EventDetail.jsx
│   ├── CreateEvent.jsx
│   ├── ReservationForm.jsx
│   ├── UserReservations.jsx
│   ├── ManageEvents.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx
│   ├── SearchBar.jsx
│   └── LoadingSpinner.jsx
├── context/                 # React Context
│   └── AuthContext.jsx     # Authentication state management
├── api/                    # API integration
│   └── apiContext.js       # All API endpoints and helpers
├── styles/                 # Component-specific CSS
│   ├── Global.css
│   ├── Header.css
│   ├── Navigation.css
│   ├── Footer.css
│   ├── EventList.css
│   ├── EventCard.css
│   ├── EventDetail.css
│   ├── CreateEvent.css
│   ├── ReservationForm.css
│   ├── UserReservations.css
│   ├── ManageEvents.css
│   ├── Auth.css
│   ├── Modal.css
│   ├── Toast.css
│   ├── SearchBar.css
│   └── LoadingSpinner.css
├── App.jsx                 # Main application component
├── App.css
├── main.jsx                # React entry point
├── index.css               # Global styles
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8081`

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd event-booking-react
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🎨 UI/UX Features

### Modern Design System
- **Color Scheme**: Professional gradient with primary color (#6366f1) and secondary (#8b5cf6)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout
- **Shadows**: Subtle depth effects for visual hierarchy

### Component Highlights
- **Responsive Grid**: Auto-fills based on available space
- **Smooth Animations**: Transitions and fade-ins for better UX
- **Loading States**: Spinner component for async operations
- **Error Handling**: Toast notifications for all error states
- **Form Validation**: Client-side validation with helpful feedback

## 🔐 Authentication

### User Types
- **Participant**: Can browse, search, and reserve events
- **Organizer**: Can create, manage events and view reservations

### Features
- User registration (both participant and organizer)
- Secure login with email/password
- Session persistence using localStorage
- Automatic token injection in API requests
- Protected routes for authenticated-only pages

## 📱 Responsive Design

The frontend is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔄 API Integration

All API calls are centralized in `src/api/apiContext.js` with the following endpoints:

### Events
- `GET /api/evenements` - Get all events
- `GET /api/evenements/actifs` - Get active events
- `GET /api/evenements/{id}` - Get event details
- `POST /api/evenements` - Create event
- `PUT /api/evenements/{id}` - Update event
- `DELETE /api/evenements/{id}` - Delete event

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/{id}` - Cancel reservation
- `GET /api/reservations/utilisateur/{id}` - Get user reservations

### Users
- `POST /api/utilisateurs/inscription/participant` - Register participant
- `POST /api/utilisateurs/inscription/organisateur` - Register organizer
- `POST /api/utilisateurs/connexion` - Login

## 🛠️ Development

### Component Usage Examples

#### EventCard
```jsx
<EventCard
  event={event}
  onViewDetails={handleSelectEvent}
  onReserve={handleReserveEvent}
  showActions={true}
/>
```

#### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Event Details"
>
  {/* Modal content */}
</Modal>
```

#### Toast
```jsx
<Toast
  message="Event created successfully!"
  type="success"
  onClose={handleClose}
  duration={3000}
/>
```

## 📦 Dependencies

- **react** (^19.2.0) - UI framework
- **react-dom** (^19.2.0) - React rendering
- **axios** (^1.13.2) - HTTP client
- **vite** (^7.2.4) - Build tool

## 🎯 Key Features

### Search & Filter
- Real-time search by event title or location
- Sort events by date, title, or availability
- Visual availability indicators

### Event Management
- Create events with detailed information
- Edit event details
- Activate/deactivate events
- Delete events (with confirmation)
- View reservation statistics

### Reservation System
- Easy one-click reservations
- Choose number of spots to reserve
- View reservation confirmation
- Cancel reservations anytime

### User Experience
- Smooth page transitions
- Loading indicators during async operations
- Toast notifications for all actions
- Modal dialogs for critical actions
- Auto-logout on session expiry

## 🔍 Testing

To test the frontend:

1. **Login as Participant**:
   - Navigate to Login page
   - Select "Participant" mode
   - Create test account or login

2. **Browse Events**:
   - Go to "Browse Events"
   - Use search/filter features
   - Click on event to view details

3. **Make Reservation**:
   - Click "Reserve Now" on any event
   - Select number of spots
   - Confirm reservation

4. **Login as Organizer**:
   - Create organizer account
   - Navigate to "Create Event"
   - Add new event details
   - Manage events from dashboard

## 📝 Notes

- Ensure backend server is running before starting frontend
- Backend should have CORS enabled for localhost:5173
- User authentication data is stored in localStorage
- Session persists until manual logout

## 📞 Support

For issues or questions, refer to:
- Backend documentation
- API endpoint specifications
- Component prop documentation in code

---

**Built with ❤️ using React and modern web technologies**
