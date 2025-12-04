# Quick Start Guide - EventHub Frontend

## ⚡ Fast Setup (5 minutes)

### 1. **Install Dependencies**
```bash
cd event-booking-react
npm install
```

### 2. **Start Development Server**
```bash
npm run dev
```

### 3. **Open Application**
- Visit: `http://localhost:5173`
- Your browser will open automatically

---

## 🧪 Test the Application

### First Time Setup
1. **Register as Participant**
   - Click on auth area → "Don't have account? Create one here"
   - Select "👤 Participant"
   - Fill in Name, Email, Password
   - Click "Create Account"

2. **Browse Events**
   - You're automatically logged in
   - See "Discover Events" page
   - Use search to find events
   - Click on event card to view details

3. **Make a Reservation**
   - Click "Reserve Now" on any event
   - Select number of spots
   - Click "Confirm Reservation"

4. **Check Your Reservations**
   - Click navigation → "My Reservations"
   - See all your bookings

### Organizer Features
1. **Create New Account (Organizer)**
   - Logout first (top right corner)
   - Click to open Login
   - "Create one here" → Select "🎭 Organizer"
   - Register account

2. **Create an Event**
   - Navigate to "Create Event"
   - Fill in event details
   - Click "Create Event"

3. **Manage Your Events**
   - Go to "Manage Events"
   - See all your created events
   - Activate/Deactivate/Delete events

---

## 📁 Project Files Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app component with routing logic |
| `src/components/` | All UI components |
| `src/api/apiContext.js` | Backend API integration |
| `src/context/AuthContext.jsx` | User authentication state |
| `src/styles/` | Component-specific styling |

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
- Make sure backend server is running on `http://localhost:8081`
- Check backend CORS settings allow `localhost:5173`

### "Page shows blank"
- Check browser console for errors (F12)
- Refresh page with Ctrl+Shift+R
- Clear localStorage: `localStorage.clear()`

### "Login not working"
- Ensure backend is responding at `http://localhost:8081/api/utilisateurs/connexion`
- Check email/password are correct
- Try creating new account

### "Events not loading"
- Verify backend has events created
- Check network tab (F12 > Network)
- Ensure `/api/evenements` endpoint responds

---

## 🎨 Key UI Elements

### Navigation
- **Top Bar**: Header with logo and user info
- **Nav Menu**: Browse Events, My Reservations, Create Event, Manage Events
- **Mobile**: Hamburger menu on small screens

### Events Page
- **Search Bar**: Find events by title or location
- **Sort Dropdown**: Sort by Date, Title, or Availability
- **Event Cards**: Click to view details or reserve immediately

### Responsive Design
- Works on: Desktop, Tablet, Mobile
- Auto-adjusts layout based on screen size
- Touch-friendly buttons and forms

---

## 💡 Features at a Glance

| Feature | Access | Description |
|---------|--------|-------------|
| Browse Events | Anyone | View all active events with filtering |
| Search | Anyone | Find events by title or location |
| Event Details | Anyone | See full event information |
| Reserve | Logged-in | Book spots at events |
| My Reservations | Participant | View and manage your bookings |
| Create Event | Organizer | Add new events to platform |
| Manage Events | Organizer | Edit, activate, delete events |
| Login/Register | Anyone | Create account and authenticate |

---

## 🚀 Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder ready for deployment.

---

## 📚 Learn More

- Full documentation: See `FRONTEND_README.md`
- Component details: Check individual component files
- API endpoints: See `src/api/apiContext.js`

---

**Ready to go! Enjoy managing events! 🎉**
