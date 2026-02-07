# Worker Booking Backend API

A clean, production-ready backend for a worker-booking application built with Node.js, Express.js, and MongoDB.

## Features

- RESTful API design
- MongoDB with Mongoose ODM
- Distance-based worker sorting using Haversine formula
- Worker availability management
- Booking persistence for app lifecycle handling
- Centralized error handling
- Environment-based configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Architecture**: MVC pattern

## Project Structure

```
backend/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### 1. Get Workers by Category

**GET** `/api/workers?category=<category>&lat=<latitude>&lng=<longitude>`

Returns available workers filtered by category, sorted by distance and rating.

**Query Parameters:**
- `category` (required): Electrician | Plumber | Carpenter | AC Engineer | Self Worker
- `lat` (required): User's latitude
- `lng` (required): User's longitude

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "category": "Electrician",
      "yearsOfExperience": 8,
      "pricePerHour": 500,
      "rating": 4.5,
      "totalCompletedJobs": 120,
      "isAvailable": true,
      "location": {
        "lat": 28.6139,
        "lng": 77.2090
      },
      "distanceInKm": 2.34
    }
  ]
}
```

### 2. Create Booking

**POST** `/api/booking`

Creates a new booking and updates worker availability.

**Request Body:**
```json
{
  "workerId": "worker_object_id",
  "estimatedHours": 2,
  "userLat": 28.6139,
  "userLng": 77.2090
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "workerId": "...",
    "workerName": "John Doe",
    "category": "Electrician",
    "pricePerHour": 500,
    "distanceInKm": 2.34,
    "estimatedHours": 2,
    "totalPrice": 1000,
    "status": "pending",
    "bookingTime": "2026-02-04T14:30:00.000Z"
  }
}
```

### 3. Get Booking by ID

**GET** `/api/booking/:bookingId`

Retrieves booking details with populated worker information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "workerId": {
      "_id": "...",
      "name": "John Doe",
      "category": "Electrician",
      "rating": 4.5,
      "location": {
        "lat": 28.6139,
        "lng": 77.2090
      },
      "isAvailable": false
    },
    "workerName": "John Doe",
    "category": "Electrician",
    "pricePerHour": 500,
    "distanceInKm": 2.34,
    "estimatedHours": 2,
    "totalPrice": 1000,
    "status": "pending",
    "bookingTime": "2026-02-04T14:30:00.000Z"
  }
}
```

## Worker Categories

- Electrician
- Plumber
- Carpenter
- AC Engineer
- Self Worker

## Database Models

### Worker Schema
- `name`: String (required)
- `category`: Enum (required)
- `yearsOfExperience`: Number (required)
- `pricePerHour`: Number (required)
- `rating`: Number (0-5, default: 0)
- `totalCompletedJobs`: Number (default: 0)
- `isAvailable`: Boolean (default: true)
- `location`: Object with lat/lng (required)

### Booking Schema
- `workerId`: ObjectId reference to Worker (required)
- `workerName`: String (required)
- `category`: Enum (required)
- `pricePerHour`: Number (required)
- `distanceInKm`: Number (required)
- `bookingTime`: Date (default: now)
- `status`: Enum (pending, confirmed, completed, cancelled)
- `estimatedHours`: Number (required, min: 0.5)
- `totalPrice`: Number (required)

## Notes

- Workers are assumed to be pre-seeded in the database
- Distance is calculated dynamically using the Haversine formula
- Worker availability is automatically updated when a booking is created
- No authentication/authorization implemented (as per requirements)
- No Firebase or AI logic included
- Designed to work with Expo/React Native frontend
