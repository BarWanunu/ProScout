<div align="center">

# ProScout ⚽️

**Intelligent Football Scouting & Player Recommendation Platform**

_Data‑driven player similarity, AI scouting reports, structured search, shortlisting & communication — in one full‑stack application._

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20PostgreSQL%20%7C%20OpenAI-blue)

</div>

## 1. Overview

ProScout is a full‑stack football scouting platform that enables clubs, scouts, and analysts to identify, compare, and justify player recruitment decisions.  
It combines a custom similarity model (60+ engineered features → embedding + cosine similarity), role & context filtering, and AI‑generated scouting briefs to surface the _most relevant_ player alternatives — not just those with good raw stats.

Key outcomes:

- Reduce manual screening time
- Standardize evaluation language across departments
- Support evidence-based decision making
- Provide dynamic shortlists aligned with tactical identity

---

## 2. Feature Matrix

| Module                   | Core Capabilities                                                       | Tech Highlights                                       |
| ------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| Player Similarity Engine | Embedding generation, cosine similarity ranking, league & age filtering | Min‑max scaling pipeline, positional numeric encoding |
| AI Scouting Reports      | 3‑candidate structured shortlist, strengths/concerns, recommended pick  | OpenAI Chat Completions + strict JSON prompt design   |
| Search & Discovery       | Multi-criteria: position, league, age, metrics, fuzzy naming            | PostgreSQL indexed queries, normalization utilities   |
| Shortlists               | Create, update, and manage candidate pools                              | CRUD endpoints + role based access                    |
| Trials Management        | Organize, schedule, track player trials                                 | Transactional persistence                             |
| Messaging                | Scout ↔ Team ↔ Player direct messages                                   | Authenticated channel + persistence                   |
| User Roles               | Scouts, Teams, Players (permission scoped)                              | JWT + role guards                                     |
| Player Profiles          | Raw stats + enriched contextual view                                    | Split source tables (model vs display)                |

---

## 3. Architecture

```
ProScout/
├── frontend/                      # Vite + React application (UI, routing, charts, report rendering)
├── backend/                       # Node.js (Express) API & model logic
│   ├── controller/                # Route controllers (similarity, reports, messaging, etc.)
│   ├── middleware/                # Auth, upload, tokens
│   ├── models/                    # Data access abstractions (lightweight)
│   ├── routes/                    # Express routers
│   ├── startup/                   # DB init + data loading scripts
│   ├── utils/                     # Token, validation, image & role utilities
│   └── data/                      # CSV source assets
```

Data Flow (Similarity):

1. CSV → `proscout_player_stats_raw` (raw display table)
2. Transformation → scaled + embedded → `proscout_player_stats` (model table)
3. API `/recommendations-system/similar/:rk` → returns baseline + top-N similar (embedding cosine)
4. AI Report endpoint refilters entire population ignoring local UI constraint size and produces structured JSON.

---

## 4. Technology Stack

### Frontend

- React (Vite build)
- React Router (navigation)
- Recharts (radar & comparative viz)
- React Query / internal data hooks (fetch orchestration) _(if added during scaling)_
- React Select & custom CSS for modern UI panels

### Backend

- Node.js + Express
- PostgreSQL (`pg`)
- OpenAI API (structured scouting briefs)
- JSON Web Tokens (auth)
- Multer (upload middleware)
- `csv-parse` (synchronous CSV ingestion)
- Custom min‑max scaling + embedding pipeline

### Data / Modeling

- Separate logical tables:
  - `proscout_player_stats`: numeric, normalized, embedding array (`FLOAT[]`).
  - `proscout_player_stats_raw`: _as‑is_ imported metrics for display only.
- Cosine similarity across ordered feature vector (Pos→final_third).
- Deterministic color & metric ordering for radar visualization.

---

## 5. Player Similarity Model

| Step                | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| Feature Selection   | 60+ engineered columns inc. possession, creation, defensive & progression metrics       |
| Positional Encoding | Position string collapsed → numeric class (GK, DF variants, MF variants, FW variants)   |
| Scaling             | Column-wise min‑max across dataset prior to embedding assembly                          |
| Embedding           | Ordered numeric array persisted in `embedding` column (FLOAT[])                         |
| Similarity          | Cosine similarity target vs every other player (O(N) scan)                              |
| Filtering Layer     | Age brackets (Young, Promising, Experienced, Veteran) + preferred league prioritization |
| Candidate Selection | Global re-ranking (not limited to initial UI page) → top 3 kept for AI reasoning        |

---

## 6. AI Scouting Report

Endpoint: `POST /recommendations-system/generate-report`  
Input: `{ selectedPlayer: { rk, ... }, teamRequirements: { style, experience, league, formation, skills[] } }`  
Process:

1. Re-fetch baseline embedding by `rk`.
2. Compute similarity for _all_ players.
3. Filter & prioritize by age rule + preferred league.
4. Select top 3 (highest similarity after ordering).
5. Prompt OpenAI with strict JSON schema (no markdown) -> parse & validate.

Output structure (ideal):

```json
{
  "players": [
    {
      "name": "...",
      "similarity_pct": 92.4,
      "league": "Ligue 1",
      "age": 23,
      "summary": "1-2 sentences",
      "strengths": ["progressive passing"],
      "concerns": ["aerial duels"],
      "fit_score": 87
    },
    {
      /* ... */
    },
    {
      /* ... */
    }
  ],
  "recommended": "Player Name",
  "reasoning": "Concise justification referencing requirements"
}
```

**Guardrails:**  
– No invented players.  
– Fit scores 0‑100.  
– Age / league constraints applied pre-prompt.  
– Fallback to raw string if JSON parse fails (UI gracefully handles both modes).

---

## 7. Environment Variables

Create `backend/.env` (never commit secrets):

```
DB_USER=postgres
DB_PASSWORD=********
DB_HOST=localhost
DB_DATABASE=ProScout
DB_PORT=5432
PORT=3000
TOKEN_SECRET=change_me
OPENAI_API_KEY=sk-...
```

**Security Reminder:** Rotate secrets when shared. Avoid pushing `.env` to remote.

---

## 8. Setup & Run

### Backend

```bash
cd backend
npm install
# Load raw (display) stats
npm run load:raw      # (creates proscout_player_stats_raw)
# Load normalized model table
npm run load:stats    # (creates proscout_player_stats with embeddings)
npm run dev           # start API with nodemon
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173 (default Vite dev port)

### Minimal Health Checks (psql)

```sql
SELECT COUNT(*) FROM proscout_player_stats_raw;     -- raw rows
SELECT COUNT(*) FROM proscout_player_stats;         -- model rows
SELECT rk, player, similarity FROM proscout_player_stats LIMIT 5; -- sanity baseline
```

---

## 9. API Surface (Representative)

| Method | Endpoint                                  | Purpose                                   |
| ------ | ----------------------------------------- | ----------------------------------------- |
| GET    | `/recommendations-system/players`         | Autocomplete / list players               |
| GET    | `/recommendations-system/similar/:rk`     | Get top similar players (UI initial view) |
| POST   | `/recommendations-system/generate-report` | AI shortlist + structured report          |
| GET    | `/recommendations-system/player-image`    | Heuristic image resolver                  |
| POST   | `/login`                                  | Auth & token issuance                     |
| CRUD   | `/shortlist`                              | Manage shortlisted players                |
| CRUD   | `/trial`                                  | Manage trial workflows                    |
| POST   | `/message`                                | Direct messaging                          |

Auth: All protected endpoints require `Authorization: Bearer <JWT>`.

---

## 10. Role & Permission Overview

| Role   | Capabilities                                                    |
| ------ | --------------------------------------------------------------- |
| Player | Manage profile, view trials, receive messages                   |
| Scout  | Generate reports, create recommendations, message teams/players |
| Team   | Search players, view recommendations, manage trials, shortlist  |

---

## 11. Data Integrity & Validation

- **Name Fuzzy Matching** (enrichment stage) ensures external naming variations resolve to unified profile metadata when available.
- Strict separation of MODEL vs DISPLAY sources prevents accidental contamination of derived features.
- Defensive null handling for radar / similarity metrics.

---

## 12. UI Highlights

| Component         | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| AIScoutTab        | Player reference, similarity radar, shortlist table |
| ScouterAI         | Filter panel + generated AI shortlist cards         |
| Role Panels       | Position cluster metrics (GK / DF / MF / FW)        |
| Messaging Widgets | Contextual quick messaging                          |

Visualization: Fixed-domain radar (0–60) with deterministic color palette; legend toggling for comparison reduction.

---

## 13. Roadmap / Future Enhancements

- 🔍 Advanced vector indexing (pgvector or external ANN)
- 📹 Video event tagging & highlight linkage
- 📱 Native mobile companion (React Native)
- 🧠 Predictive progression modeling (expected growth curves)
- 🧾 Export & automated PDF dossier generation
- 🔔 Real-time websocket notifications

---

## 14. Developer Workflow

| Step | Action                                  |
| ---- | --------------------------------------- |
| 1    | Pull & install dependencies             |
| 2    | Load raw and model tables               |
| 3    | Start backend then frontend             |
| 4    | Generate similarity & AI report from UI |
| 5    | Iterate on feature / prompt adjustments |

---

## 15. Attribution & Ownership

**Author:** Bar Wanunu and Michael Afraimov

---

_Built with passion for intelligent recruitment in modern football._ ⚽️
