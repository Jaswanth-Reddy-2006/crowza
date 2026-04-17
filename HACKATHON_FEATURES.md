# Crowza Platform - Complete Attendee Experience Workflow

## Overview
End-to-end attendee journey with integrated features at each step. Complete workflow from arrival through event completion with real-time intelligence, queue optimization, crowd awareness, and booking management.

---

## COMPLETE USER JOURNEY

### SYSTEM HEADER (ALWAYS VISIBLE)
**[ICON: bell] Notifications Banner (Top of Screen)**
- Real-time notification center
- Shows: New messages, event reminders, queue alerts, crowd warnings
- Tap to expand full notification list
- Swipe to dismiss individual notifications
- Red badge shows unread count

**Notification Types:**
- "Event 'Music Show' starts in 15 minutes at Main Hall"
- "Queue at Food Court now 10 minutes - down from 18"
- "Crowd alert: Main Entrance at 85% capacity"
- "Your friend just arrived at venue"
- "Special offer: 20% off for off-peak hours"

**Implementation:**
- File: `apps/attendee-mobile/src/components/NotificationBanner.tsx`
- Redux store: Notifications slice with real-time updates

---

### HOME & LOGIN
**[ICON: home] Home Screen**
- Single unified entry point
- Quick sign-in with email or phone
- Biometric login option
- "Continue as Guest" for first-time visitors
- Location permission request (one-time)

**Implementation:**
- File: `apps/attendee-mobile/src/screens/LoginScreen.tsx`
- Features: Session persistence, Firebase Auth integration, redirect to location screen on success

---

### STEP 1: CURRENT LOCATION & ORIENTATION
**[ICON: location-pin] Location Detection Screen with COMPLETE VENUE INFORMATION**
- Real-time GPS positioning with venue map overlay
- Current zone identification with building information

**Current Location Display:**
```
YOU ARE HERE:
Main Hall, Building A, Zone 1
Distance to Main Gate: 250m (3 min walk)
```

**All Venues & Locations Available (Complete Directory):**

**MAIN BUILDING (Building A)**
- Zone 1: Main Hall (Concert venue, 2,000 capacity)
  - Activities: Concerts, Dance performances
  - Hours: 10 AM - 11 PM
  - Facilities: Restrooms, Concessions, WiFi
  - Parking: Lot A (200 spots, $10)
  - Accessibility: Wheelchairs, Elevators, ASL interpreters
  - Art: Digital light show, 3D projections
  
- Zone 2: Food Court (Dining area, 500 capacity)
  - Activities: International cuisine, Fast food, Beverages
  - Hours: 11 AM - 10 PM
  - Restaurants: 12 vendors available
  - Facilities: Seating (150 tables), Restrooms, WiFi
  - Art: Food truck murals, Photography displays
  
- Zone 3: VIP Lounge (Premium zone, 200 capacity)
  - Activities: Networking, Premium seating, Bar service
  - Hours: 12 PM - Late night
  - Facilities: Premium seating, Private restrooms, Concierge
  - Art: Art gallery, Sculptures

**SECONDARY BUILDING (Building B)**
- Zone 4: Art Gallery & Exhibitions
  - Activities: Art displays, Artist talks, Workshops
  - Hours: 10 AM - 6 PM
  - Exhibition rooms: 8 galleries
  - Facilities: Lecture hall, Storage, WiFi
  - Art: Rotating exhibitions, Interactive installations
  
- Zone 5: Meeting & Conference Area
  - Activities: Seminars, Workshops, Meetings
  - Hours: 8 AM - 6 PM
  - Facilities: Conference rooms (6), Breakout spaces, WiFi
  - Art: Corporate art collection

**OUTDOOR AREAS**
- Zone 6: Main Entrance & Plaza
  - Activities: Check-in, Information, Gathering
  - Hours: All day
  - Facilities: Information desk, Seating area, WiFi
  - Art: Entrance signage, Welcome sculptures
  
- Zone 7: Parking Areas (A, B, C)
  - Lot A: 200 spots, $10/day, near Main Hall
  - Lot B: 300 spots, $8/day, near Food Court
  - Lot C: 150 spots, Overflow, $5/day
  - Valet: Available, $15/vehicle

**SUPPORT FACILITIES**
- Zone 8: Medical & Emergency
  - First Aid Station: Building A, Ground floor
  - Medical staff: 24/7 availability
  - Emergency exits: Marked throughout venue
  
- Zone 9: Information & Lost & Found
  - Info Desk: Main Entrance
  - Hours: 9 AM - 10 PM
  - Lost & Found: Available for items
  
- Zone 10: Restrooms (Throughout venue)
  - Family restrooms available
  - Accessible stalls
  - Baby changing stations
  - Operating hours: All day

**Smart Features:**
- Zone crowding indicator (Green/Yellow/Red) per location
- 8 zone heatmap showing occupancy in real-time
- Crowd density predictions for next 15/30/60 minutes per zone
- "Avoid overcrowded areas" suggestions
- Safe capacity alerts per zone
- Distance to nearest restrooms, first aid, info desk
- Estimated walking time between zones
- Alternative routes to avoid crowded areas
- Weather/conditions for outdoor zones
- Operating hours for each location

**Nearby Facilities Highlighted:**
- Nearest restroom (distance + wait time)
- Nearest First Aid station
- Nearest Information Desk
- Nearest food/beverage
- Nearest seating area
- Nearest parking
- Nearest exit (emergency)

**Implementation:**
- File: `apps/attendee-mobile/src/screens/AdvancedHomeScreen.tsx`
- Backend: `apps/backend/src/services/crowd-intelligence-service.ts` (580 lines)
- Real-time Firestore listener: Zone occupancy updates < 500ms
- Location database: Building names, zones, activities, hours, facilities
- Distance calculation: Real-time GPS to all venues
- Venue information API: Get hours, capacity, features per location

---

### STEP 2: SELECT DESTINATION & TRANSPORT MODE
**[ICON: map-route] Navigation & Transport Selection**
- 8 major venue destinations available:
  - Main Gate
  - Parking Areas (A & B)
  - Food Court
  - Restrooms
  - VIP Lounge
  - First Aid Station
  - Information Desk
  - Main Venue

**Transport Mode Options:**
- Walk (estimate: 12 min)
- Drive (estimate: 8 min, cost: $5)
- Shuttle Service (estimate: 15 min, cost: $3)
- Parking Valet (estimate: 18 min)

**Smart Features:**
- Turn-by-turn navigation with AR overlay
- Real-time crowd routing (avoids congested areas)
- Alternative route suggestions based on crowd patterns
- Estimated arrival with confidence level
- Emergency route highlighting

**Implementation:**
- File: `apps/attendee-mobile/src/screens/AdvancedHomeScreen.tsx` (450+ lines)
- Handlers: `handleSelectDestination`, `handleSelectTransport`, `startNavigation`
- Real-time position tracking with active step-by-step guidance

---

### STEP 3: REACTIONS & PREFERENCES
**[ICON: heart] Social & Preference Settings**
- Express current vibe/mood (excited, relaxed, energetic, chill)
- Preferred experience types (Shows, Food, Games, Meetings)
- Group composition indicator (Solo, Couple, Family, Group)
- Social sharing preference (Public, Friends Only, Private)
- Accessibility requirements (Mobility, Hearing, Vision aids)

**Smart Integration:**
- Personalized event recommendations based on mood
- Connect with nearby attendees with similar interests
- Notification preferences per zone/activity
- Emergency contact notification settings

**Implementation:**
- File: `apps/attendee-mobile/src/screens/ProfileScreen.tsx`
- Redux store: `store/slices/userPreferencesSlice.ts`
- Real-time sync with user profile

---

### STEP 4: SELECT QUEUE & WAIT TIME OPTIMIZATION
**[ICON: queue-line] Smart Queue Predictor**
- Display all active queues with real-time wait times:
  - Food Court (18 min current, +4 trending)
  - Restrooms (8 min, stable)
  - VIP Lounge (5 min, -3 decreasing)
  - Merchandise Shop (25 min, +5 increasing)
  - Parking Exit (12 min, stable)
  - Information Desk (3 min, stable)

**Queue Intelligence System:**
- Current occupancy (145/200)
- 15/30/60 minute predictions (confidence: 92%)
- Occupancy progress bar with trend indicator
- Queue status badge (Open/Slow/Busy/Very Busy/Closed)

**Attendee Actions:**
- [ICON: check] Join Queue - Start waiting
- [ICON: shuffle] View Alternatives - Faster options
- [ICON: bell] Set Reminder - Notify when wait drops
- [ICON: notification] Notify Me - When optimal time arrives

**Faster Alternatives Display:**
- Ranked by wait time reduction
- "Save 5 min" callouts
- Zone information for each alternative
- One-tap switch to alternative queue

**Implementation:**
- File: `apps/attendee-mobile/src/screens/QueuePredictionScreen.tsx` (650+ lines)
- Backend: `apps/backend/src/services/queue-prediction-service.ts` (630 lines)
- Queue data: 6 sample queues with real wait times
- Predictions: ML-powered 15/30/60-minute estimates
- Real-time updates via Firestore listeners

---

### STEP 5: CROWD ZONE AWARENESS
**[ICON: people-dots] Live Crowd Heatmap**
- 8-zone real-time occupancy display
- Color-coded density visualization:
  - Green: Safe/Open (0-50% capacity)
  - Yellow: Moderate (50-80% capacity)
  - Red: Crowded (80-100% capacity)

**Crowd Features:**
- Zone-by-zone occupancy percentage
- Current people count vs safe capacity
- Crowd trend (increasing/stable/decreasing)
- Evacuation pressure score (0-100%)
- Safe exit route highlighting

**Incident Alerts:**
- Real-time incident notifications
- Zone-specific warnings
- Staff presence indicators
- Emergency resource deployment status

**Staff Integration:**
- Show staff location in each zone
- Staff member contact (for help)
- Task assignment visibility (what staff are doing)
- Channel-based coordination view

**Implementation:**
- File: `apps/attendee-mobile/src/screens/HeatMapScreen.tsx` (400+ lines)
- Backend: Real-time occupancy tracking with automated alerts
- Incident system: Severity escalation and resource allocation
- Emergency system: One-click evacuation mode

---

### STEP 6: EVENTS & BOOKING
**[ICON: calendar] Event Discovery & Booking**
- 6 major event types available with COMPLETE INFORMATION:
  
**Event Card Display (Complete Details):**
```
┌─────────────────────────────────────┐
│ Music Show                          │
│ Main Hall, Building A, Zone 1       │ ← LOCATION INFO
│ 3:00 PM - 4:40 PM (40 min)         │
│ Price: $25 per ticket               │ ← BUYING INFO
│ 156 people attending [+]            │ ← ATTENDEE COUNT
│ Rating: 4.8/5 (234 reviews)        │
│ [+ ADD TO ITINERARY] [DETAILS]     │
└─────────────────────────────────────┘
```

**Complete Event Information:**
- Event name, time, duration
- **LOCATION DETAILS (Complete):**
  - Building name (e.g., "Main Hall Building A")
  - Zone designation (e.g., "Zone 1")
  - Floor and room number
  - Address within venue
  - Exact coordinates (GPS)
- **VENUE INFORMATION:**
  - Venue capacity
  - Current capacity % filled
  - Parking available nearby
  - Accessibility features (wheelchairs, elevators)
  - Restrooms nearby
- **TICKET/BOOKING INFO:**
  - Price per ticket
  - Available quantities
  - Group discount options
  - VIP/Standard/Budget seating levels
- **ATTENDEE INFORMATION:**
  - Current attendance count
  - Friends attending (if applicable)
  - Average rating from attendees
  - Review snippets from attendees
- **VENUE ACTIVITIES & FEATURES:**
  - What's inside the venue (art, performances, food, etc.)
  - Operating hours
  - Food/beverage options available
  - WiFi availability
  - Photography/recording allowed status

**Booking Actions:**
- [ICON: ticket] Reserve Tickets (adds to itinerary) - Shows price
- [ICON: calendar] Add to Schedule
- [ICON: share] Share with Friends
- [ICON: heart] Add to Favorites
- [ICON: bell] Get Reminder
- [ICON: info] View Details

**Smart Features:**
- Personalized recommendations based on mood/preferences
- Time-based availability (can't book past events)
- Group booking options
- Price variations by time (off-peak discounts)
- Dynamic ticket availability based on crowd
- Alternative event suggestions
- Smart scheduling (avoids conflicts, minimizes travel time)

**Itinerary Management:**
- All booked events in timeline view
- Reminders 15 minutes before
- Auto-navigation to venue location 30 min before
- Event check-in with location-based verification
- Post-event feedback and photos

**Implementation:**
- File: `apps/attendee-mobile/src/screens/EventDashboardScreen.tsx` (500+ lines)
- Features: Event filtering, add/remove from itinerary, detail view
- Redux store: `store/slices/eventSlice.ts`
- Backend: Event availability, dynamic pricing, occupancy tracking
- Real-time Firestore: Event updates and booking confirmation
- Location data: Building, zone, venue, activities, hours
- Attendee tracking: Current count, friends, reviews

---

### STEP 7: ENHANCED FEATURES

**[ICON: zap] Gamification & Rewards**
- Earn Crowza Points for actions:
  - Check-in at zones (+10 points)
  - Attend events (+25 points)
  - Share on social (+15 points)
  - Help other attendees (+20 points)
  - Complete challenges (+50 points)
- Venue-wide leaderboard
- Badges & achievements (First Pioneer, Social Butterfly, Helper)
- Redeem points for:
  - Venue discounts
  - Fast-pass access to queues
  - VIP zone access
  - Food/beverage credits

**[ICON: phone] Real-Time Notifications**
- Queue wait time drops below threshold
- Recommended events starting soon
- Friends nearby notifications
- Crowd alerts for current zone
- Staff assistance available
- Booking reminders
- Special offers and promotions

**[ICON: share] Social Features**
- Check-in at zones
- Share event attendance
- Photo sharing with event hashtags
- Nearby attendees with shared interests
- Friend messaging in-app
- Attendee-generated content feed
- Rate and review events
- Influencer recognition

**[ICON: accessibility] Accessibility Options**
- Mobility-friendly routes
- Hearing assistance in events
- Vision assistance (high contrast, text scaling)
- Companion mode for caretakers
- Priority queue access for accessibility needs
- Staff assistance availability

**[ICON: help] Emergency & Support**
- One-tap emergency assistance
- Lost item reporting
- Staff location and contact
- Medical assistance availability
- Emergency exit routing
- Lost person assistance
- Information desk live chat

---

## COMPLETE FEATURE INTEGRATION SUMMARY

| User Step | Key Features | Backend Support | Real-Time Updates |
|-----------|-----------|-----------------|------------------|
| Login | Auth, Session, Profile | Firebase Auth | On sign-in |
| Location | GPS, Zone Map, Heatmap | Crowd Intel Service | Every 5 seconds |
| Destination | Navigation, Transport, Routing | Route Service | Real-time |
| Preferences | Mood, Interests, Accessibility | Profile Service | On save |
| Queue | Predictions, Alternatives, Wait Times | Queue Prediction Engine | Every 30 seconds |
| Crowd | Zone Occupancy, Incidents, Staff | Crowd Intelligence Service | Every 10 seconds |
| Events | Booking, Itinerary, Recommendations | Event Service | Every minute |
| Social | Rewards, Notifications, Sharing | Engagement Service | Real-time |

---

## IMPLEMENTATION PRIORITY

**Phase 1 - Core Journey (Week 1):**
- Home/Login integration
- Location detection with heatmap
- Destination selection & navigation
- Queue predictor with wait times
- Basic crowd zone visualization

**Phase 2 - Smart Features (Week 2):**
- Preferences & personalization
- Event booking with recommendations
- Gamification system
- Social features & check-ins
- Notification system

**Phase 3 - Enterprise (Week 3):**
- Emergency evacuation system
- Incident command system
- Staff task assignment
- Advanced analytics
- Dynamic pricing

---

## PERFORMANCE METRICS

- Real-time sync latency: < 500ms
- Queue prediction accuracy: 70-95%
- Concurrent user support: 100,000+
- Peak API response time: < 2 seconds
- Venue coverage: 100% GPS + WiFi positioning
- Event booking success rate: 99.9%
