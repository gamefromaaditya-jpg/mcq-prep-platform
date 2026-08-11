# PRODUCTION DEPLOYMENT GUIDE

## 1. Firebase Hosting Setup (Spark Tier Compatible)

```bash
# 1. Install Firebase CLI globally if not present
npm install -g firebase-tools

# 2. Authenticate with Firebase
firebase login

# 3. Initialize Firebase Hosting in workspace
firebase init hosting
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub Actions: Optional

# 4. Build production bundle
npm run build

# 5. Deploy rules and static assets to Firebase Hosting
firebase deploy --only hosting,firestore:rules,storage:rules
```

---

## 2. Deploying Firestore Rules and Indexes
To deploy Firestore security rules and composite indexes:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```
