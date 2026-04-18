# Features Documentation 🎯

## Passenger Features

### 1. Smart Navigation System
**Overview**: AI-powered route recommendation based on real-time crowd density and user profile.

**How it Works**:
- User selects current location, destination, and profile type
- DecisionEngine computes all possible paths using graph traversal
- Routes are scored based on:
  - Current crowd density at each zone
  - Distance and travel time
  - Accessibility constraints (stairs, luggage, etc.)
  - User profile preferences

**Profiles Available**:
- **Normal**: Standard passenger
- **Elderly / Reduced Mobility**: Avoids stairs, prefers slower routes
- **With Heavy Luggage**: Avoids stairs, prefers flat terrain
- **In a Hurry**: Avoids crowded areas to maintain walking speed

**Output**:
- Top 2 recommended routes
- Estimated travel time
- AI reasoning for why each route is suggested
- Real-time density warnings

### 2. Real-Time Heatmap Visualization
**Overview**: Visual representation of crowd density across 11 station zones.

**Features**:
- Color-coded zones (Green/Safe, Yellow/Busy, Red/Congested)
- Animated updates every 3 seconds
- Zone density percentages
- Emergency mode highlighting
- Platform and facility identification

**Zones Included**:
- Entry: Main Entrance
- Facilities: Ticket Counter
- Waiting Areas: Hall A, Hall B
- Transit: Footbridge 1, Footbridge 2
- Platforms: Platform 1, 2, 3
- Exits: Exit A, Exit B

### 3. PNR Status Checker
**Overview**: Check booking status and seat information.

**Features**:
- 10-digit PNR number validation
- Real-time booking confirmation status
- Detailed passenger information
- Seat number and status
- Chart preparation status
- Journey details (From/To stations)

**Data Displayed**:
- PNR and Booking Status
- Train Name and Number
- Boarding Station and Destination
- Seat Number and Confirmation Status
- Chart Preparation Status

### 4. Live Train Schedule
**Overview**: Real-time train schedules for Dhanbad Junction.

**Features**:
- Displays all trains arriving in next 2 hours
- Expected arrival times
- Platform assignments
- Train classification
- "Check Seats" option

**Updates**:
- Auto-refreshes every 30 seconds
- Manual refresh available
- Loading states and error handling

### 5. AI Chatbot Assistant
**Overview**: Floating chat widget for quick queries and assistance.

**Capabilities**:
- Asks about specific platforms
- Reports crowded areas
- Provides exit directions
- Responds to emergency situations
- Proactively alerts about station alerts

**Interaction**:
- Toggle with floating button
- Message history preserved
- Smooth animations
- Alert badge for active alerts

### 6. Best Time Predictor
**Overview**: AI recommendation for optimal travel times.

**Prediction**:
- Analyzes historical time-of-day patterns
- Suggests off-peak hours
- Provides confidence metric
- Helps avoid peak congestion

## Admin Features

### 1. Station Overview Dashboard
**Overview**: High-level station metrics and status.

**Metrics Displayed**:
- Average crowd density across station
- Current time profile (Peak/Off-Peak/Moderate)
- Total number of active zones
- Real-time status indicator

### 2. Bottleneck Detection
**Overview**: Automatic identification of severely congested areas.

**Alerts When**:
- Zone density exceeds 75%
- Zone type is not an exit
- Maintains up to 2 active alerts

**Information**:
- Affected zone name
- Current density percentage
- Severity indicator
- Auto-clears when congestion reduces

### 3. Density Analytics Dashboard
**Overview**: Comprehensive analytics with charts and visualizations.

**Visualizations**:
- **Bar Chart**: Zone-by-zone density distribution
- **Pie Chart**: Density breakdown by zone type
- **KPI Cards**: Key performance indicators

**Data Shown**:
- Average density percentage
- Peak density zone
- Active zone count
- Zone type comparison

**Zone Type Distribution**:
- Entry
- Facility (Ticket Counter)
- Waiting (Halls)
- Transit (Footbridges)
- Platform
- Exit

### 4. Live Zone Status Table
**Overview**: Real-time table of all zones with status indicators.

**Columns**:
- Zone Name
- Zone Type
- Current Density %
- Status (Clear/Busy/Congested)

**Status Colors**:
- 🟢 Green (Clear): < 40%
- 🟡 Yellow (Busy): 40-75%
- 🔴 Red (Congested): > 75%

### 5. Emergency Controls
**Overview**: Critical admin feature for emergency situations.

**Evacuation Mode**:
- One-click activation
- Redirects all passengers to nearest exits
- Bypasses all normal routing logic
- Visual red banner confirms active evacuation
- Freezes crowd density updates

**Effects**:
- Non-exit zones marked as dangerous
- Exit zones highlighted as safe
- Chatbot switches to emergency mode
- Passengers get evacuation alerts
- All route recommendations point to exits

**Deactivation**:
- Click "Stand Down Evacuation" to restore normal operations
- System resumes regular crowd simulation
- Normal routing logic reactivates

### 6. System Alerts Monitoring
**Overview**: View all active system alerts.

**Alert Types**:
- Congestion alerts (density > 85%)
- Evacuation alerts (when to mode active)
- System status messages

**Information Per Alert**:
- Alert message
- Timestamp
- Severity level
- Clear or active status

## Core Engine Features

### Simulation Engine
**Purpose**: Simulates realistic crowd flow patterns.

**Time Slots**:
All stations experience 6 different time-of-day profiles:
1. **06:00 AM**: Off-Peak (0.5x multiplier)
2. **08:30 AM**: Peak (1.5x multiplier)
3. **11:00 AM**: Off-Peak (0.7x multiplier)
4. **01:30 PM**: Moderate (1.0x multiplier)
5. **05:30 PM**: Peak (1.8x multiplier)
6. **09:00 PM**: Moderate (0.9x multiplier)

**Dynamics**:
- Random variance ±10% per zone
- Train arrivals spike platforms by 30%
- Time advances randomly every ~15 seconds
- Density oscillates around time-based baseline
- Zone-specific updates every 3 seconds

### Decision Engine
**Components**:
1. **Graph Traversal**: Finds all possible paths (max depth 5)
2. **Path Scoring**: Evaluates based on multiple factors
3. **Profile Adaptation**: Modifies score based on user needs
4. **Ranking**: Returns top 2 alternatives

**Scoring Factors**:
- Crowd density (major weight)
- Distance/travel time
- Stairs presence
- Peak congestion zones
- User profile compatibility

### Integration Points
**Ready for Real Data**:
- SimulationEngine → Firebase Firestore (live CCTV data)
- DecisionEngine → Real pathfinding APIs
- RailAPI → Indian Railways RapidAPI
- Chatbot → Larger NLP/LLM services

## Performance Features

### Optimization
- Lightweight bundle (~500KB uncompressed)
- Efficient re-rendering with React hooks
- Memoized computations for routes
- Debounced simulation updates

### Responsiveness
- Real-time updates every 3 seconds
- Smooth CSS transitions
- Animated alerts and notifications
- Non-blocking state updates

### Accessibility
- Keyboard navigation
- High-contrast color scheme
- Semantic HTML structure
- ARIA labels on interactive elements

## Security Features

### Data Protection
- No personal data stored locally
- PNR checking uses mock data (ready for API integration)
- Session-based operation
- Input validation on all forms

### Future Enhancements
- User authentication
- Encrypted PNR transmission
- Rate limiting on APIs
- GDPR compliance
- Two-factor authentication for admins

---

## Feature Roadmap 🗺️

### Phase 2 (Planned)
- [ ] User accounts and saved preferences
- [ ] Historical analytics and trend analysis
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real facility bookings integration
- [ ] Accessibility enhancements

### Phase 3 (Planned)
- [ ] Machine learning optimization
- [ ] Predictive crowd modeling
- [ ] Integration with station PA system
- [ ] Staff app for crowd management
- [ ] Advanced reporting

---

Last Updated: April 2026
