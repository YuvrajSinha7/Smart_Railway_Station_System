# Quick Start Guide ⚡

Get the Smart Station app running in 5 minutes!

## System Requirements
- **Windows, macOS, or Linux**
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## Option A: Quick Start (Fastest)

### Step 1: Navigate to Project
```bash
cd "c:\Users\91920\OneDrive\Desktop\PromptWars\physical event experience"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
The terminal will show you the local URL (usually `http://localhost:5173`)

## Option B: Production Build

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

## Testing the App

### Passenger View
1. Go to `http://localhost:5173`
2. Select a passenger profile
3. Choose a starting location and destination
4. View recommended routes
5. Click "PNR Status" tab to check booking
6. Click "Trains" tab to see schedule

### Admin View
1. Click "Admin" in the header
2. View station metrics and heatmap
3. Click "Analytics" tab for detailed charts
4. Click "Alerts" tab to see system alerts
5. Try "Emergency Controls" to trigger evacuation (then stand down)

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors
```bash
# Reinstall dependencies
npm install

# Clear Vite cache
rm -rf dist .vite
npm run dev
```

## Project Structure Quick Reference

```
src/
├── pages/
│   ├── PassengerDashboard.jsx  ← Passenger interface
│   └── AdminDashboard.jsx      ← Admin interface
├── components/
│   ├── Heatmap/
│   ├── Analytics/
│   ├── PNR/
│   └── Train/
├── engine/
│   ├── SimulationEngine.js     ← Crowd simulation
│   └── DecisionEngine.js       ← Route calculation
└── App.jsx                      ← Main app
```

## Key Features to Try

1. **Smart Navigation** 🧭
   - Select profile and destination
   - See AI-recommended routes
   - Read AI explanations

2. **Heatmap** 🔥
   - Watch density update in real-time
   - See color-coded zones
   - View platform congestion

3. **PNR Checker** 🎫
   - Enter any 10-digit PNR
   - See booking details

4. **Admin Dashboard** 👨‍💼
   - View analytics charts
   - See bottleneck alerts
   - Trigger emergency mode

## API Integration Info

### To Use Real Railways API:
1. Get API key from RapidAPI
2. Update `railApi.js` with real endpoints
3. Configure environment variables

### To Use Live Crowd Data:
1. Replace `SimulationEngine.js` with Firebase listener
2. Set up Firestore database
3. Configure Firebase in `.env`

## Next Steps

1. ✅ App is running!
2. 📖 Read [FEATURES.md](FEATURES.md) for detailed feature documentation
3. 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
4. 🔌 Review [railApi.js](src/services/railApi.js) for API integration
5. 💾 Read [README.md](README.md) for full documentation

## Need Help?

### Check Documentation:
- [Full README](README.md)
- [Features Guide](FEATURES.md)
- [Deployment Guide](DEPLOYMENT.md)

### Browser Console
Press `F12` in your browser to see any error messages

### Check Network Tab
Monitor API calls and responses in browser DevTools

## Deployment Tips

### Firebase (Recommended)
```bash
npm run build
firebase deploy
```

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --dir=dist
```

## Performance Tips

- Use Chrome DevTools to profile performance
- Check bundle size: `npm run build` then check `dist/` folder
- Enable caching in production
- Use a CDN for faster delivery

---

**Happy coding! 🚀**

For more detailed information, see the complete documentation files.

Last Updated: April 2026
