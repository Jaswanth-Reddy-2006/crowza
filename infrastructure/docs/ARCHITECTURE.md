# System Architecture

## Overview
The Venue Experience Platform is built on a microservices architecture using Google Cloud Platform.

## Components
1. **Frontend**: React (Web) and React Native (Mobile)
2. **Backend**: Node.js Express microservices in Cloud Run
3. **Data**: Firestore for real-time state, PostgreSQL for persistent data
4. **Real-time**: FCM for notifications, Firestore for live updates
