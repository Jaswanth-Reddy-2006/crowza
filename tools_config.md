# Crowza Platform Tools & Configuration

This document outlines the tools, technologies, and configurations used across the Crowza Venue Experience Platform, including advanced indoor navigation and comprehensive security measures.

## Frontend (Mobile Apps)
- **Framework**: React Native + Expo (SDK 48)
- **Styling**: Standard React Native `StyleSheet` (Standardized Light Theme)
- **State Management**: Redux Toolkit (RTK) with Redux Persist
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Icons**: Lucide React Native / Expo Vector Icons
- **Animation**: React Native Animated API / Lottie
- **Security**: Expo SecureStore for token management

## Indoor Navigation & Mapping
- **Routing Algorithm**: Custom A* Pathfinding Engine
  - Heuristic optimization with Euclidean distance
  - Heat map integration for crowd avoidance
  - Obstacle detection and dynamic recalculation
  - Wheelchair accessibility enforcement
- **Navigation Mesh**: Custom data structure with nodes, edges, and obstacles
  - Support for multiple floor levels
  - Amenity mapping (restrooms, food, medical, etc.)
  - Seat-level accuracy for sports venues
- **Location Tracking**:
  - GPS via `expo-location` (outdoor positioning)
  - BLE trilateration (indoor positioning - future)
  - WiFi fingerprinting (indoor positioning - future)
  - Fuzzy logic fusion of multiple signals
- **Mapping Visualization**: 
  - SVG rendering for indoor maps (`react-native-svg`)
  - Interactive seat-level maps with zoom/pan
  - Real-time occupancy overlay
  - Heat map visualization

## Backend & Services
- **Language**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Firebase Cloud Firestore (Real-time data)
- **Authentication**: Firebase Auth + Custom JWT
- **Real-time Sync**: Firestore Listeners with optimized queries
- **Microservices Architecture**:
    - **Venue Service**: Manages zones, points of interest, floor plans, and navigation meshes.
    - **Incident Service**: Real-time safety and staff dispatch.
    - **Notification Service**: Cloud messaging and push notifications.
    - **Navigation Service**: Indoor routing calculations and optimization.
    - **Location Service**: Position aggregation and privacy protection.

## Security & Compliance
- **Input Validation**: Comprehensive validation for all user inputs
  - Email validation (RFC 5322 compliant)
  - Node/Seat ID validation (alphanumeric)
  - Coordinate validation (geographic bounds)
  - Navigation mesh validation (structure integrity)
- **Data Sanitization**: XSS prevention with HTML entity encoding
- **Rate Limiting**: Token-bucket algorithm (100 req/min per user)
- **Encryption**:
  - TLS 1.3 for all API communication
  - AES-256 for sensitive data at rest
  - Secure token storage in platform-native storage
- **Audit Logging**: Comprehensive event logging with:
  - Authentication events
  - Authorization failures
  - API calls and errors
  - Location updates (aggregated)
  - Security alerts and incidents
- **CORS & CSRF Protection**: Security headers on all responses
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection headers
  - Content-Security-Policy

## Mapping & Geospatial
- **Outdoor Mapping**: `react-native-maps` (Google Maps Provider)
- **Web Fallback**: OpenStreetMap (OSM) via `iframe` integration
- **Indoor Maps**: 
  - Custom SVG Floorplans with occupancy overlays
  - GeoJSON support for vector floor plans
  - AutoCAD-JSON format parsing (future)
  - Real-time amenity and obstacle updates

## Networking & API
- **HTTP Client**: Axios with custom interceptors
  - Automatic token refresh
  - Retry logic with exponential backoff
  - Request/response validation
  - Security header injection
- **WebSockets**: Firebase Realtime Database listeners
  - Optimized queries (subscribe to needed zones only)
  - Automatic reconnection
  - Offline support via local caching

## State Management & Caching
- **Redux**: Centralized state for venue, occupancy, navigation data
- **Redux Persist**: Local storage of app state
- **Async Storage**: `@react-native-async-storage/async-storage` for non-sensitive data
- **Secure Storage**: `expo-secure-store` for authentication tokens

## Testing & Quality
- **Unit Testing**: Jest framework
  - Security validation tests
  - Routing algorithm tests
  - API client tests
- **E2E Testing**: Detox (planned)
  - Full user flow testing
  - Navigation scenario testing
  - Security scenario validation
- **Static Analysis**: ESLint + Prettier
  - OWASP security rules
  - Best practice enforcement
- **Dependency Scanning**: Regular vulnerability scanning

## CI/CD & Deployment
- **Version Control**: Git (Monorepo with Turborepo)
- **Package Manager**: npm with Workspace support
- **Bundler**: 
  - Metro (React Native)
  - Webpack (Web)
- **Build System**: EAS Build (Expo Application Services)
  - Android APK/AAB builds
  - iOS IPA builds
  - Automatic signing and provisioning
- **Deployment**: 
  - Cloud Run for backend services
  - Firebase Hosting for static assets
  - Google Cloud Storage for indoor maps

## Configuration Management

### Environment Variables
```
REACT_APP_FIREBASE_API_KEY=<key>
REACT_APP_FIREBASE_PROJECT_ID=<id>
REACT_APP_API_BASE_URL=https://api.crowza.com
REACT_APP_MAPS_API_KEY=<key>
NODE_ENV=production
```

### Firebase Configuration
```typescript
// src/config/firebase.ts
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "crowza.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "crowza.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
```

### API Keys Configuration
- **Google Maps API**: Configured in `app.json` for Android/iOS
- **Firebase Config**: Found in `src/config/firebase.ts`
- **API Endpoints**: Configured via environment variables
- **Secrets**: Stored in Firebase Secret Manager (not in code)

## Monitoring & Analytics
- **Error Tracking**: Custom error boundary with Sentry integration (future)
- **Performance Monitoring**: Firebase Performance Monitoring
- **Audit Logging**: Comprehensive event logging (see security_measures.md)
- **Usage Analytics**: Firebase Analytics for user behavior insights
- **Real-time Dashboards**: Firebase Console and custom dashboards

## Mobile-Specific Tools
- **Gestures**: `react-native-gesture-handler` for swipe/pinch controls
- **Safe Area**: `react-native-safe-area-context` for notch handling
- **Status Bar**: Expo-managed status bar
- **Notifications**: `expo-notifications` for push notifications
- **Blur Effects**: `expo-blur` for UI polish
- **Linear Gradients**: `expo-linear-gradient` for backgrounds

## Development Tools
- **TypeScript**: Strict mode for type safety
- **IDEs**: Visual Studio Code + Expo plugins
- **Debugging**: React Native Debugger, Chrome DevTools
- **Logging**: Custom logger with severity levels
- **Code Generation**: TypeScript code generators for types

## Performance Optimization
- **Code Splitting**: Lazy loading of route components
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: SVG for maps, WebP for photos
- **Font Subsetting**: Only required fonts loaded
- **Bundle Analysis**: Regular bundle size reviews
- **Caching**: Aggressive caching with cache invalidation strategy

## Compliance & Standards
- **GDPR**: Data protection and privacy compliance
- **CCPA**: California Consumer Privacy Act
- **OWASP**: Protection against Top 10 vulnerabilities
- **SOC 2**: Security controls documentation
- **Accessibility (WCAG 2.1)**: Level AA compliance target
