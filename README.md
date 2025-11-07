# TerpMeet - Connect & Attend Events

A beautiful student event management platform for making friends and attending events. Built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start (Full Stack)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### 1. Clone and Setup Backend

```bash
# Install backend dependencies
npm install

# Make sure MongoDB is running on localhost:27017
# Or update .env with your MongoDB URI

# Start backend server (runs on http://localhost:5000)
npm start
```

### 2. Setup Frontend (in a new terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install frontend dependencies
npm install

# Start frontend dev server (runs on http://localhost:3000)
npm run dev
```

### 3. Open Your Browser
Navigate to `http://localhost:3000` and start using TerpMeet!

## 📱 Features

### Frontend
- Beautiful animated UI with Framer Motion
- Responsive design with Tailwind CSS
- Login/Signup with smooth transitions
- Real-time event feed
- Event creation modal
- Detailed event pages with attendee lists
- Join/Leave events functionality
- User profile tracking

### Backend
- RESTful API with Express
- MongoDB database with Mongoose
- Full CRUD operations for users and events
- Many-to-many relationships
- Automatic attendee population
- Event creator tracking

## 🎨 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide Icons

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- CORS enabled

## 📂 Project Structure

```
TerpMeet/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CreateEventModal.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── EventDetails.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── models/
│   ├── User.js
│   └── Event.js
├── routes/
│   ├── users.js
│   └── events.js
├── server.js
├── package.json
└── .env
```

## 🛠️ Development

### Backend Development
```bash
# Start with auto-reload
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 📖 API Documentation

## API Endpoints

### Users

#### Create User
```
POST /api/users
Body: {
  "username": "johndoe",
  "password": "password123",
  "name": "John Doe",
  "majorYear": "Computer Science - Sophomore",
  "interests": "Gaming, Basketball, Coding",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get All Users
```
GET /api/users
```

#### Get User by ID
```
GET /api/users/:id
```

#### Update User
```
PUT /api/users/:id
Body: { "interests": "New interests" }
```

#### Delete User
```
DELETE /api/users/:id
```

### Events

#### Create Event
```
POST /api/events
Body: {
  "title": "Basketball Game",
  "time": "2024-01-15T18:00:00Z",
  "place": "Eppley Recreation Center",
  "description": "Pickup basketball game, all skill levels welcome!",
  "creatorId": "USER_ID_HERE"
}
```
Note: Creator is automatically added as an attendee.

#### Get All Events
```
GET /api/events
```
Returns events with full attendee details (username, name, avatar, majorYear, interests).

#### Get Event by ID
```
GET /api/events/:id
```
Returns event with populated creator and attendee details.

#### Update Event
```
PUT /api/events/:id
Body: {
  "title": "Updated Title",
  "time": "2024-01-16T18:00:00Z"
}
```

#### Delete Event
```
DELETE /api/events/:id
```

### Event Attendance

#### Join Event
```
POST /api/events/:id/attend
Body: { "userId": "USER_ID_HERE" }
```

#### Leave Event
```
DELETE /api/events/:id/attend
Body: { "userId": "USER_ID_HERE" }
```

## Database Schema

### User
- `username` (String, unique, required)
- `password` (String, required)
- `name` (String, required)
- `majorYear` (String, required)
- `interests` (String)
- `avatar` (String)
- `createdAt` (Date)

### Event
- `title` (String, required)
- `time` (Date, required)
- `place` (String, required)
- `description` (String, required)
- `creatorId` (ObjectId, ref: User, required)
- `attendees` (Array of ObjectIds, ref: User)
- `createdAt` (Date)

## Features
- Full CRUD operations for users and events
- Many-to-many relationship between users and events
- Automatic population of attendee details (shows full user info)
- Event creator tracking
- Join/leave event functionality
