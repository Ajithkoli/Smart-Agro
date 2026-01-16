# Smart Agriculture Cloud Platform - SDG 2 Zero Hunger

## Overview
The Smart Agriculture Cloud Platform is a production-ready IoT solution designed to empower farmers with real-time insights, thereby increasing crop yield, optimizing resource usage, and supporting the **United Nations Sustainable Development Goal 2: Zero Hunger**.

### SDG 2 Connection
- **IoT Monitoring**: Reduces water and fertilizer waste through precision agriculture.
- **Smart Recommendations**: Helps farmers take timely action to prevent crop diseases and stress.
- **Productivity**: Increases agricultural productivity and incomes of small-scale food producers.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Deployment**: Google Cloud Ready (App Engine / Cloud Run)

## Project Structure
- `/backend` - REST API & Database Models
- `/frontend` - React User Interface
- `/docs` - Additional Documentation

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Google Maps API Key (Optional for map integration)

### Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure Environment:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` and `JWT_SECRET`
4. Run Server: `npm run dev` (Runs on port 5000)

### Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Run App: `npm run dev` (Accessible at http://localhost:5173)

### IoT Ingestion (Simulating a Device)
To simulate an IoT device sending data, send a POST request to `http://localhost:5000/api/iot/ingest`:
```json
{
  "deviceId": "NODE-001",
  "apiKey": "YOUR_GENERATED_KEY",
  "soilMoisture": 25.5,
  "temperature": 32.1,
  "humidity": 45.0,
  "pH": 6.8,
  "rainfall": 0
}
```

## Google Cloud Deployment

### Backend (Cloud Run)
1. Add `Dockerfile` to `/backend`.
2. Build image: `gcloud builds submit --tag gcr.io/PROJECT-ID/smart-agri-backend`
3. Deploy: `gcloud run deploy --image gcr.io/PROJECT-ID/smart-agri-backend --platform managed`

### Frontend (Firebase Hosting or Cloud Run)
1. Build: `npm run build`
2. serve the `dist` folder via Nginx or Firebase.

## Key Features
- **Live Dashboard**: Visualize farm status.
- **Sensor Telemetry**: Real-time charts for moisture, temp, etc.
- **Rule-Based Engine**: Smart alerts for irrigation and health.
- **Secure Access**: Role-based JWT authentication (Farmer vs Admin).
