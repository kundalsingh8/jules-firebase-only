# Deployment Guide

## Prerequisites
1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Logged into Firebase (`firebase login`)
3. Flutter SDK installed (for mobile app)

## Backend & Web App Deployment (Firebase)

1. **Set Firebase Project**
   ```bash
   firebase use kundal-security-platform
   ```

2. **Deploy Functions & Security Rules**
   ```bash
   firebase deploy --only functions,firestore:rules,storage
   ```

3. **Deploy Web App**
   ```bash
   cd web-app
   npm run build
   cd ..
   firebase deploy --only hosting
   ```
   *Note: CI/CD via GitHub Actions is also configured to auto-deploy to Hosting on pushes to the `main` branch.*

## Mobile App Deployment (Flutter)

1. **Configure Firebase**
   ```bash
   cd mobile-app
   flutterfire configure
   ```

2. **Build APK for Android Guards**
   ```bash
   flutter build apk --release
   ```

3. **Distribute**
   Use Firebase App Distribution or manual APK installation for guard devices.
