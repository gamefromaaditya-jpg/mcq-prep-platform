# MARK — Exam Preparation Platform (Day 1 Master Build)

A production-quality exam preparation platform designed for competitive exams (JEE Main, NEET, GATE). Built from scratch with React, TypeScript, Vite, Tailwind CSS, and Firebase.

---

## 🌟 Key Architecture & Features

- ⚡ **Zero Cloud Functions Overhead**: Built 100% compatible with the **Firebase Spark (No-Cost) Plan**.
- 🛡️ **Role-Based Architecture**: Strict separation of concerns for `ADMIN`, `TEACHER`, and `STUDENT` roles.
- 📐 **Comprehensive Question Engine Schema**: Fully typed models for `single_correct`, `multiple_correct`, `integer`, `numerical` (with tolerance), and `match` matrix questions.
- 🎨 **Modern Design System**: Built with Tailwind CSS, custom design tokens, dark mode compatibility, accessible dialogs, toasts, skeletons, and glassmorphism elements.
- 🔒 **Database & Storage Security**: Conservative Cloud Firestore & Storage rules protecting data boundaries.
- 🧪 **Unit Tested**: Pure scoring algorithms and role guards verified via Vitest & React Testing Library.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript (Strict), Vite, Tailwind CSS, Lucide Icons, React Router v6
- **Backend / BaaS**: Firebase Authentication, Cloud Firestore, Cloud Storage, Firebase Hosting
- **Testing**: Vitest, React Testing Library, jsdom

---

## 🚀 Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in your Firebase configuration keys:
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Local Development Server
```bash
npm run dev
```

### 4. Run Test Suite
```bash
npm run test
```

### 5. Typecheck & Build Bundle
```bash
npm run build
```

---

## 📁 Documentation Suite

Detailed architecture, database models, and operational guides are available in the `docs/` folder:
- 📄 [docs/PROJECT_AUDIT.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/PROJECT_AUDIT.md) — Initial repository audit and roadmap
- 📄 [docs/ARCHITECTURE.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/ARCHITECTURE.md) — Application design & component hierarchy
- 📄 [docs/DATABASE.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/DATABASE.md) — Firestore collection schema & Spark efficiency
- 📄 [docs/SECURITY.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/SECURITY.md) — Role permissions matrix & Security rules
- 📄 [docs/TEST_ENGINE.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/TEST_ENGINE.md) — Question evaluation & scoring rules
- 📄 [docs/DEVELOPMENT.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/DEVELOPMENT.md) — Developer setup & CLI reference
- 📄 [docs/DEPLOYMENT.md](file:///c:/Users/YUVRAJ/OneDrive/Desktop/mcq%20app/docs/DEPLOYMENT.md) — Production hosting & rule deployment
