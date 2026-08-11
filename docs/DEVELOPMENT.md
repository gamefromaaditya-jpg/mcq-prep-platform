# LOCAL DEVELOPMENT GUIDE

## 1. Prerequisites
- Node.js `v18.0.0` or higher (Verified on `v24.16.0`)
- npm `v9.0.0` or higher (Verified on `11.13.0`)
- Git

---

## 2. Installation & Setup

```bash
# 1. Clone repository & enter workspace
cd "mcq app"

# 2. Copy environment template
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start Vite local development server
npm run dev
```

---

## 3. Available NPM Commands
- `npm run dev`: Launch local Vite dev server on `http://localhost:5173`.
- `npm run build`: Typecheck and produce optimized production bundle in `dist/`.
- `npm run lint`: Execute strict TypeScript typecheck (`tsc --noEmit`).
- `npm run test`: Run Vitest unit test suite.
- `npm run test:watch`: Run Vitest in interactive watch mode.
