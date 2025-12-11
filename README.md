# SmartBudgetAI MVP

Dieses Repository enthält ein Strapi-Backend und eine Vue-3-Frontend-App, die den SmartBudgetAI-Prototyp bereitstellen. Das Ziel: personalisierte Budgetanalyse, Chat-Coach, Sparziele und Transaktionsbewertung.

## Backend (Strapi)
- Läuft unter `backend/` mit Strapi 4, konfigurierbar über SQLite oder Postgres (`config/database.ts`).
- Content-Types: `transaction` und `savings-goal` (Relation zu Users-Permissions User).
- Custom-Routen
  - `POST /transactions/analyzeAndCreate`
  - `GET /transactions/user`
  - `GET /analysis/summary`
  - `POST /goals/fromText`
  - `GET /goals/user`
  - `POST /chat`
- Agentenlogik in `src/services/agents.ts` (OpenAI-Aufrufe, Budgetplanung, Intent-Erkennung).
- Kaggle-Importskript in `src/kaggle/importKaggleData.ts` zum Vorverarbeiten historischer Datensätze.

### Starten
```bash
cd backend
npm install
npm run develop
```

## Frontend (Vue 3 + TypeScript)
- Läuft unter `frontend/` (Vite).
- Seiten: Login/Registrierung, Sparziele (Chat + Ziele), Analyse, Verlauf, Neue Transaktion.
- API-Service (`src/services/api.ts`) hängt JWT automatisch an.

### Starten
```bash
cd frontend
npm install
npm run dev
```

## Erweiterungen
- Kaggle-Rohdaten unter `backend/data/kaggle/` ablegen; Skript passt die Felder an und importiert sie.
- OpenAI-Key via `OPENAI_API_KEY` setzen, andernfalls läuft ein Platzhalter.
