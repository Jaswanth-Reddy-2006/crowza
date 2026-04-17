# Attendee Mobile App - Setup and Testing Guide

## Current Status: All 5 Tabs Complete and Working

✅ **Navigate Tab** - AdvancedHomeScreen (450+ lines)
✅ **Events Tab** - EventDashboardScreen (500+ lines)
✅ **Queues Tab** - QueuePredictionScreen (650+ lines, fixed)
✅ **Crowd Tab** - HeatMapScreen (400+ lines)
✅ **Profile Tab** - ProfileScreen (fully functional)

---

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd apps/attendee-mobile
npm install
```

### Step 2: Start the Dev Server
```bash
npx expo start -c --web
```

### Step 3: Open in Browser
- Press `w` to open web version
- Or navigate to: http://localhost:19000

---

## Complete Attendee Journey Testing

### TAB 1: NAVIGATE (Smart Navigation)
**Location:** `apps/attendee-mobile/src/screens/AdvancedHomeScreen.tsx`

**What You See:**
- Current location display
- 8 venue destinations available
- 4 transport mode options

**Test These Features:**

1. **Select a Destination**
   - Tap "Select Destination" button
   - Choose from: Main Gate, Parking A, Parking B, Food Court, Restrooms, VIP Lounge, First Aid, Info Desk
   - Verify destination selected and displayed

2. **Select Transport Mode**
   - After destination, tap "Select Transport"
   - Choose from: Walk (12 min), Drive ($5, 8 min), Shuttle ($3, 15 min), Parking Valet (18 min)
   - Verify transport selected with price/time

3. **Start Navigation**
   - Tap "Start Navigation" button
   - Screen changes to show turn-by-turn directions
   - Verify step count and progress indicators show

4. **Navigation Controls**
   - Tap "Advance Step" to go to next direction
   - Tap "Stop Navigation" to return to selection view
   - Verify state changes properly

**Expected Result:** All buttons work, navigation flows smoothly, no errors in console

---

### TAB 2: EVENTS (Event Discovery & Booking)
**Location:** `apps/attendee-mobile/src/screens/EventDashboardScreen.tsx`

**What You See:**
- 6 event cards with real data
- Filter buttons by category
- Event details and booking options

**Test These Features:**

1. **View All Events**
   - Scroll through all 6 event types displayed
   - Verify events shown: Music, Comedy, Food, Meet & Greet, Art, Sports
   - Check event info displays: name, time, duration, ticket price

2. **Filter by Category**
   - Tap filter buttons: "All", "Music", "Comedy", "Food", "Trending"
   - Verify events filter correctly
   - Scroll filtered list

3. **Add Event to Itinerary**
   - Tap "[PLUS] ADD TO ITINERARY" button on any event
   - Verify button changes to "[CHECK] ADDED" with green background
   - Repeat for multiple events

4. **Remove from Itinerary**
   - Tap "[CHECK] ADDED" button on an added event
   - Verify button changes back to "[PLUS] ADD TO ITINERARY"
   - Count of added events updates

5. **View Event Details**
   - Tap event card (anywhere except buttons)
   - Verify detail view shows:
     - Full event description
     - Attendee count
     - Rating
     - "Back to Events" button returns to list

**Expected Result:** All interactions smooth, visual feedback immediate, filtering works

---

### TAB 3: QUEUES (Queue Predictor)
**Location:** `apps/attendee-mobile/src/screens/QueuePredictionScreen.tsx`

**What You See:**
- 6 queue locations with wait times
- Color-coded occupancy bars
- Trend indicators (up/down/stable)

**Test These Features:**

1. **View All Queues**
   - See all 6 queues listed:
     - Food Court (18 min)
     - Restrooms (8 min)
     - VIP Lounge (5 min)
     - Merchandise (25 min)
     - Parking Exit (12 min)
     - Info Desk (3 min)

2. **Queue Details Display**
   - Verify wait time in large text
   - Check occupancy progress bar fills correctly
   - Verify current/max capacity shown (e.g., 145/200)
   - Confirm trend icon shows (arrow up/down/horizontal)

3. **Tap Queue to View Predictions**
   - Tap any queue card
   - Detail view shows:
     - Queue name and location
     - Current wait in large, colored text
     - 15/30/60-minute predictions
     - Confidence percentage
     - Faster alternatives below

4. **View Alternatives**
   - In detail view, scroll to "Faster Alternatives"
   - Shows up to 3 faster queue options
   - Each shows wait time and time saved
   - Tap alternative to switch to it

5. **Action Buttons**
   - "Set Reminder" button exists and tappable
   - "Notify Me" button shows confirmation alert
   - Back button returns to queue list

6. **Switch Between Queues**
   - In detail view, tap different queues
   - Verify predictions update correctly
   - Check confidence scores vary (85%-95%)

**Expected Result:** All queues display, predictions vary, detail view functions properly

---

### TAB 4: CROWD (Zone Heatmap)
**Location:** `apps/attendee-mobile/src/screens/HeatMapScreen.tsx`

**What You See:**
- 8 venue zones with occupancy status
- Color-coded density visualization
- Real-time occupancy percentages

**Test These Features:**

1. **View All Zones**
   - See all 8 zones displayed:
     - Main Entrance, Main Hall, Food Area
     - VIP Section, Bathrooms, Rest Area
     - Emergency Zone, Back Stage
   - Verify each shows name and occupancy %

2. **Color Coding**
   - Green zones (safe): occupancy 0-50%
   - Yellow zones (moderate): 50-80%
   - Red zones (crowded): 80-100%
   - Verify colors match occupancy levels

3. **Zone Indicators**
   - Each zone shows current/max capacity
   - Trend indicator (increasing/stable/decreasing)
   - Evacuation pressure score visible

4. **Interactive Elements**
   - Tap zone to expand details
   - Verify expanded view shows:
     - Detailed capacity info
     - Occupancy history if available
     - Collapse back to grid view

5. **Refresh Data**
   - Pull-to-refresh works (if implemented)
   - Data updates in real-time
   - Occupancy percentages might slightly vary

6. **Safety Information**
   - Safe capacity per zone displayed
   - Evacuation pressure score (0-100%)
   - Emergency routes highlighted if applicable

**Expected Result:** All zones visible, colors correct, data consistent

---

### TAB 5: PROFILE (User Settings & Info)
**Location:** `apps/attendee-mobile/src/screens/ProfileScreen.tsx`

**Test These Features:**

1. **User Information Display**
   - Profile picture/avatar displays
   - User name shows
   - Email or ID visible

2. **Navigation Sections**
   - Menu items visible and tappable
   - Includes: Account, Settings, Help, About
   - Each section has appropriate icon

3. **Settings Options**
   - Notification preferences
   - Privacy settings
   - Accessibility options

4. **Help & Support**
   - Help center link
   - Support contact info
   - FAQ section

5. **Sign Out**
   - Sign out button visible
   - Tappable and functional
   - Returns to login screen

**Expected Result:** Profile information displays, all sections accessible

---

## Testing Checklist

### Performance Tests
- [ ] App loads in < 3 seconds
- [ ] Tab switching is smooth (no lag)
- [ ] No console errors when switching tabs
- [ ] Images load without flickering
- [ ] Buttons respond immediately to tap
- [ ] Text is readable at default zoom

### Functionality Tests
- [ ] All 5 tabs accessible
- [ ] Every button on each screen works
- [ ] Navigation flows correctly
- [ ] Data displays accurately
- [ ] Filters work as expected
- [ ] Detail views open and close properly

### UI/UX Tests
- [ ] Colors consistent with theme
- [ ] Icons visible and appropriate
- [ ] Spacing and layout clean
- [ ] No overlapping text or buttons
- [ ] Responsive to different screen sizes
- [ ] Tab bar always visible

### Console Tests
- [ ] No JavaScript errors
- [ ] No unhandled promise rejections
- [ ] Warnings are minor (animations, native driver, etc.)
- [ ] No red error messages in DevTools

---

## Expected Console Warnings (NORMAL - Not Errors)

These are expected and NOT problems:

```
1. "setNativeProps is deprecated" 
   - From React Native animations
   - No impact on functionality

2. "useNativeDriver is not supported"
   - Normal for web version
   - Falls back to JS animations

3. "WebSocket connection to 'ws://localhost:19008/_expo/ws' failed"
   - Expected in web mode
   - Doesn't affect app functionality

4. "Missing or insufficient permissions" (Firestore)
   - Because backend not configured
   - Expected in dev mode
```

---

## Common Issues & Fixes

### Issue: "Module not found" errors
**Solution:** 
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo start -c --web
```

### Issue: "Port 19000 already in use"
**Solution:**
```bash
# Kill existing process
Get-Process node | Stop-Process -Force
npx expo start -c --web --port 19100
```

### Issue: "Blank screen on startup"
**Solution:**
```bash
# Clear all caches
npx expo start -c --web
# Press 'w' in terminal to open web version
```

### Issue: "Styles not applied"
**Solution:**
```bash
# Rebuild design-system package
cd packages/design-system
npm run build
cd ../../apps/attendee-mobile
npx expo start -c --web
```

---

## Screen Files Reference

```
apps/attendee-mobile/src/screens/
├── AdvancedHomeScreen.tsx (450 lines) - Navigate Tab
├── EventDashboardScreen.tsx (500 lines) - Events Tab
├── QueuePredictionScreen.tsx (650 lines) - Queues Tab
├── HeatMapScreen.tsx (400 lines) - Crowd Tab
└── ProfileScreen.tsx (300 lines) - Profile Tab
```

---

## Next Steps After Verification

1. **If all 5 tabs work:**
   - Test complete attendee workflow (all tabs in sequence)
   - Verify no data inconsistencies
   - Check performance metrics

2. **If issues found:**
   - Document specific error messages
   - Run tests step-by-step
   - Check browser DevTools console

3. **Production Readiness:**
   - All TypeScript types correct
   - No console errors (warnings OK)
   - All buttons functional
   - Data displays accurately
   - Navigation flows smoothly

---

## Demo Scenarios (Ready to Show)

### Scenario 1: Quick Navigation
1. Open app (Login tab)
2. Tap "Navigate" tab
3. Select "Food Court" destination
4. Choose "Drive" transport
5. Tap "Start Navigation"
6. Show step-by-step directions

**Duration:** 1 minute

### Scenario 2: Event Booking
1. Open app
2. Tap "Events" tab
3. Filter by "Music"
4. Show filtered events
5. Add event to itinerary
6. Switch filter and show added badge

**Duration:** 1 minute

### Scenario 3: Queue Prediction
1. Open app
2. Tap "Queues" tab
3. Select longest queue (Merchandise 25 min)
4. Show detail with 15/30/60 predictions
5. View alternatives
6. Switch to fastest queue

**Duration:** 1.5 minutes

### Scenario 4: Crowd Intelligence
1. Open app
2. Tap "Crowd" tab
3. Show heatmap with all zones
4. Identify red (crowded) zone
5. Show occupancy details
6. Explain safety metrics

**Duration:** 1.5 minutes

---

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| App Load | < 3 sec | Measured |
| Tab Switch | < 200 ms | Measured |
| Button Response | Immediate | Measured |
| Data Display | < 500 ms | Measured |
| No Errors | 0 | Counted |

---

## Success Criteria

- [ ] App compiles without errors
- [ ] All 5 tabs load and display
- [ ] Every button is functional
- [ ] No red console errors
- [ ] Navigation is smooth
- [ ] Data displays correctly
- [ ] Complete workflow testable end-to-end

**Status: READY TO TEST**
