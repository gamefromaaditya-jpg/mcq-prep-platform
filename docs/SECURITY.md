# SECURITY & AUTHORIZATION MODEL

## 1. Principles
1. **Zero Trust Frontend**: UI role guards exist purely for user experience. Database authorization is enforced exclusively through Cloud Firestore and Storage security rules.
2. **Credential Safety**: No private Firebase service keys, API tokens, or credentials are checked into source code. Client API keys are injected via environment variables (`.env`).

---

## 2. Role Permissions Matrix

| Resource Collection | Unauthenticated | Student Role | Teacher Role | Admin Role |
| :--- | :---: | :---: | :---: | :---: |
| `users/{userId}` | ❌ Denied | Read self | Read self | Full Read/Write |
| `questions/*` | ❌ Denied | Read published | Read published | Full Create/Edit/Delete |
| `tests/*` | ❌ Denied | Read published | Create/Edit/Assign | Full Read/Write |
| `attempts/*` | ❌ Denied | Read/Create Own | Read Authorized Students | Full Read/Write |
| `storage/questions/*` | ❌ Denied | Read images | Upload images | Upload/Delete images |

---

## 3. Environment Variable Security
All client configuration variables follow the `VITE_` prefix standard:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```
`.env` files are ignored in `.gitignore`. `.env.example` provides the safe development template.
