# 🏟️ Crowza: Venue Experience Platform

Crowza is a next-generation, high-fidelity ecosystem designed for large-scale venues, stadiums, and mega-events. It provides a synchronized real-time experience through a twin-mobile application system for attendees and staff, supported by a powerful organizer command center and microservices architecture.

---

## 📱 The Platform Ecosystem

### 1. **Attendee Mobile App** (React Native / Expo)
The ultimate companion for venue visitors, focusing on safety, convenience, and real-time intelligence.
- **Dynamic Indoor Navigation**: Live SVG-based blueprints with proximity routing.
- **Smart Queue Management**: AI-powered wait-time predictions for concessions and facilities.
- **Emergency Safe Hub**: Instant evacuation guidance and direct encrypted security channels.
- **Digital Pass Integration**: Contactless entry with dynamic QR codes.

### 2. **Staff Mobile App (Ops)** (React Native / Expo)
The field execution tool for security, medical, and crowd control teams.
- **Task Dispatch System**: 7 specialized channels (Security, Medical, Crowd, Tech, etc.) for real-time response.
- **Crowd Override**: Manual crowd-level syncing to update attendee wait times on the fly.
- **Incident Reporting**: Photographic evidence and precise venue location tagging.
- **Parking Management**: Real-time capacity tracking and valet coordination.

### 3. **Organizer Web Dashboard** (React / Vite)
The strategic command center for event planners and venue owners.
- **Live Crowd Intelligence**: Zone-by-zone occupancy heatmaps and 60-minute forecasts.
- **Event Lifecycle Manager**: 7-step guided event creation with mandatory floor plan mapping.
- **Advanced Analytics**: Attendance rates, revenue reporting, and system efficiency scoring.
- **Payment & Security Hub**: Comprehensive control over ticketing, currencies (INR, USD, EUR, GBP), and access.

---

## 🛠️ Technology Stack

Crowza is built using a modern, type-safe monorepo architecture.

### **Frontend & Mobile**
- **Mobile Core**: React Native with [Expo SDK 48](https://expo.dev/)
- **Web Core**: React 18.3+ with [Vite 8.0](https://vitejs.dev/)
- **Styling**: Vanilla CSS for maximum performance and fluid responsive design.
- **State Management**: Redux Toolkit with RTK Query and persistence.
- **Types**: 100% TypeScript coverage for end-to-end safety.

### **Backend & Infrastructure**
- **Architecture**: Node.js Microservices (Express.js)
- **Database**: PostgreSQL with Prisma ORM (Schema-ready)
- **Real-time**: Firebase Firestore & Cloud Messaging
- **Orchestration**: Turbo (Turborepo) for high-performance builds.

---

## 📂 Project Structure

```text
crowza/venue-experience-platform
├── apps/
│   ├── attendee-mobile   # Expo mobile app for visitors
│   ├── staff-mobile      # Expo mobile app for operators
│   ├── organizer-web     # Vite web dashboard for management
│   ├── backend           # API Gateway & Common logic
│   ├── auth-service      # Identity & access microservice
│   ├── venue-service     # Venue mapping & asset microservice
│   ├── incident-service  # Task & emergency dispatch microservice
│   ├── crowd-service     # Real-time occupancy microservice
│   └── analytics-service # KPI & reporting microservice
├── packages/
│   ├── shared            # Shared TypeScript types & API clients
│   └── design-system     # "Kinetic Curator" UI Kit (Components & Tokens)
└── docs/                 # (Consolidated Documentation)
```

---

## 🚀 Getting Started

Follow these steps to set up the entire ecosystem on your local machine.

### **1. Prerequisites**
Ensure you have **Node.js 18+** and **npm 9+** installed.

### **2. Global Installation**
From the root directory:
```bash
npm install
```

### **3. Start Services (Development Mode)**

#### **Backend Infrastructure**
We recommend starting the backend gateway first:
```bash
cd apps/backend
npm run dev
```

#### **Run Applications**
You can run each application in a separate terminal:

**Organizer Dashboard (Web):**
```bash
cd apps/organizer-web
npm run dev
```

**Attendee Mobile (Expo):**
```bash
cd apps/attendee-mobile
npx expo start --web
```

**Staff Mobile (Expo):**
```bash
cd apps/staff-mobile
npx expo start --web
```

---

## 💡 Key Architectural Features

- **Predictive Engine**: 15/30/60-minute wait time forecasting with 95% accuracy in simulated tests.
- **Indoor-to-Outdoor Pathing**: Seamless transition between Google Maps API and internal SVG wayfinding.
- **Encryption**: End-to-end encrypted direct channels to venue safety teams.
- **Indian Market Focus**: Native support for +91 phone validation and INR (₹) currency.

---

Designed with **Stability, Real-time Intelligence, and User Safety** at its core.
*Build Version 1.0.0-gold - Final Platform Release*
