# Franchise.it

Monorepo containing the frontend app and Python matching backend.

## Structure

- `frontend/Franchiseet_v01` - React + Vite frontend
- `pythoind/franchise-matcher` - FastAPI backend for matching

## Local Run

### 1. Backend

```bash
cd pythoind/franchise-matcher
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend/Franchiseet_v01
npm install
npm run dev
```

Frontend expects:

- `VITE_API_BASE_URL=http://localhost:8000`
- Firebase `VITE_FIREBASE_*` values in `frontend/Franchiseet_v01/.env`

## Smoke Check

- Backend health: `http://localhost:8000/health`
- Backend docs: `http://localhost:8000/docs`
- Frontend app: `http://localhost:5173`