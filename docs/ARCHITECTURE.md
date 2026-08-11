# SYSTEM ARCHITECTURE DOCUMENTATION

## 1. Architectural Overview
The MARK Exam Preparation Platform is built as a single-page application (SPA) using React 18, TypeScript (Strict), Vite, and Tailwind CSS. Backend services are powered by Firebase (Authentication, Cloud Firestore, Cloud Storage, and Hosting) while remaining 100% compliant with the **Firebase Spark (No-Cost) Plan**.

```
+-------------------------------------------------------------------+
|                        Browser Client (React SPA)                 |
|                                                                   |
|  +-------------------+   +--------------------+   +------------+  |
|  | AuthContext       |   | AppRouter Guard    |   | UI System  |  |
|  | User Session &    |-->| Role-Based Routes  |-->| (Tailwind) |  |
|  | Firestore Profile |   | (Admin/Teacher/    |   |            |  |
|  +-------------------+   |  Student Shells)   |   +------------+  |
|                            +--------------------+                 |
+--------------------------------------|----------------------------+
                                       | HTTPS Client SDK
                                       v
+-------------------------------------------------------------------+
|                     Firebase Cloud Backend (Spark)                 |
|                                                                   |
|  +-------------------+   +--------------------+   +------------+  |
|  | Firebase Auth     |   | Cloud Firestore    |   | Storage    |  |
|  | Email/Password    |   | Document DB &      |   | Question   |  |
|  | Security Tokens   |   | Security Rules     |   | Images     |  |
|  +-------------------+   +--------------------+   +------------+  |
+-------------------------------------------------------------------+
```

---

## 2. Key Architectural Guarantees
1. **Zero Cloud Functions Requirement**: The application operates without requiring Node.js server runtimes or Cloud Functions, eliminating runtime costs.
2. **Spark-Optimized Read Patterns**: Document reads are optimized via query pagination (`limit`, `startAfter`) and cached client collections.
3. **Role Isolation**: Frontend route guards (`ProtectedRoute`) enforce UX navigation, while Cloud Firestore Security Rules enforce actual database access boundaries.

---

## 3. Directory Layout & Layer Responsibilities
- `src/app/`: Core app configuration, router definition (`AppRouter.tsx`), and global context providers.
- `src/components/`: Reusable UI foundation (`Button`, `Input`, `Card`, `Dialog`, `Select`, `Badge`, `Tabs`, `Toast`, `Skeleton`, `EmptyState`, `ErrorState`).
- `src/features/`: Domain-driven feature modules (Auth, Admin, Questions, Tests, Attempts, Results, Analytics).
- `src/firebase/`: SDK initialization and typed helpers (`config.ts`, `auth.ts`, `firestore.ts`, `storage.ts`).
- `src/services/`: Client-side data services (`subjectService.ts`, `questionService.ts`, `csvImportService.ts`).
- `src/types/`: Centralized TypeScript data models and domain enums (`user.ts`, `question.ts`, `test.ts`, `attempt.ts`, `subject.ts`, `csv.ts`).
- `src/utils/`: Pure utility functions (Role authorization, test engine scoring, question validation).
