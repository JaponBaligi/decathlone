# Decathlon.com.tr Clone

Vue 3 e-commerce frontend (Atomic Design) with an Express + SQLite API.

## Stack

- **Client:** Vue 3, Vite, Vue Router, Pinia — `atoms` → `molecules` → `organisms` → `templates` → `pages`
- **Server:** Express REST API
- **DB:** SQLite at `data/decathlon.sqlite` (also regenerable via seed)

## Setup

```bash
npm install
npm run seed
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001

Demo account after seed: `demo@decathlon.local` / `demo1234`

## Notes

Large assets (SQLite, seed JSON dumps, brand fonts) are stored with Git LFS.
