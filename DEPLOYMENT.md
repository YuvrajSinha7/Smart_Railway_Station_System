# Deployment Guide 🚀

This guide covers deploying the Smart Crowd Management System to various hosting platforms.

## Prerequisites
- Production build created: `npm run build`
- Node.js 16+ (for server-side deployments)
- Git repository (recommended)

## Option 1: Firebase Hosting (Recommended)

### Setup
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase Project**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure Firebase**:
   - Select your Firebase project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite `dist/index.html`

4. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### Features
- Global CDN with automatic caching
- SSL certificate included
- Easy rollback and versioning
- Analytics integration available
- Functions support for API endpoints

## Option 2: Vercel

### Setup
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Connect Git** (optional):
   - Push to GitHub, connect repository in Vercel dashboard
   - Auto-deploy on every push

### Reference
https://vercel.com/docs/frameworks/react

## Option 3: Netlify

### Setup
1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy via CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Connect Git**:
   - Push to GitHub
   - Connect repository in Netlify dashboard
   - Auto-deploy on push

### Features
- Functions support (for backend logic)
- Form handling built-in
- Analytics included
- Easy environment variables management

## Option 4: Traditional Server (AWS, DigitalOcean, etc.)

### Setup
1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Copy dist folder** to your server public directory

3. **Configure web server** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/smart-station/dist;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable HTTPS** using Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables

Create a `.env` file for production:

```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_FIREBASE_CONFIG=your_firebase_config
```

Usage in code:
```javascript
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
```

## Integration with Real Data

### For Railway APIs
1. Get API keys from RapidAPI or Indian Railways API
2. Update `railApi.js` to use real endpoints instead of mocks:

```javascript
export const RailAPI = {
  async checkPNR(pnr) {
    const response = await fetch(
      `https://api-endpoint.com/pnr/${pnr}`,
      {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'railwayapi.p.rapidapi.com'
        }
      }
    );
    return response.json();
  }
};
```

### For Live Crowd Data (Firebase)
Replace `SimulationEngine.js` with:

```javascript
import { db } from './firebase-config.js';
import { onSnapshot, collection } from 'firebase/firestore';

export default function useSimulationEngine() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'stationZones'),
      (snapshot) => {
        const newZones = {};
        snapshot.forEach((doc) => {
          newZones[doc.id] = doc.data();
        });
        setZones(newZones);
      }
    );
    
    return unsubscribe;
  }, []);
  
  return { zones, ... };
}
```

## Performance Optimization

### Build Size
- Current size: ~500KB (uncompressed)
- Gzipped: ~150KB
- Bundle analysis: `npm install -g rollup` and analyze

### Recommended Optimizations
1. **Code Splitting**: Route-based splitting is already enabled
2. **Image Optimization**: Use WebP format for images
3. **Caching Strategy**: Set long cache headers for static assets
4. **CDN**: Use a CDN for faster global delivery

## Monitoring & Logging

### Firebase Console
- View real-time logs
- Monitor hosting usage
- Check performance metrics

### Sentry Integration (Optional)
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
});
```

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify API endpoints are correct
- Clear browser cache and rebuild

### API Errors
- Verify API keys are set in environment variables
- Check CORS headers from API
- Test API endpoints in Postman

### Performance Issues
- Enable caching in web server
- Use CDN for assets
- Implement code splitting
- Monitor bundle size

## CI/CD Pipeline Example (GitHub Actions)

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: your-firebase-project-id
```

## Rollback Procedures

### Firebase
```bash
firebase hosting:channels:list
firebase hosting:clone-version production
```

### Netlify
- Use dashboard to revert to previous deployment

### Traditional Server
- Keep backup of previous dist folder
- Use git tags for version management

## Security Checklist
- [ ] Enable HTTPS/SSL
- [ ] Set security headers (CSP, X-Frame-Options, etc.)
- [ ] Validate all user inputs
- [ ] Secure API keys (never commit to git)
- [ ] Enable rate limiting
- [ ] Implement authentication if needed
- [ ] Regular security audits

## Support & Resources
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

Last Updated: April 2026
