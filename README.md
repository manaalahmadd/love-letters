# Love Letters

A private, guided letter-writing app inspired by John Gray's "Private Session"
concept in *Men Are from Mars, Women Are from Venus* — AI-personalized prompts
walk you through the Anger → Hurt → Fear → Regret → Love format, letters are
encrypted at rest, and old letters quietly resurface later.

## Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite (swap for Postgres later), JWT auth, Fernet encryption, Claude API for prompt personalization
- **Frontend**: Next.js 14 (App Router), Tailwind, TypeScript

Tested end-to-end: signup → login → prompt generation → letter creation →
listing all verified working. Frontend build verified clean (0 errors, 9 routes).

## Getting started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows (PowerShell: .\venv\Scripts\Activate.ps1)
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt

cp .env.example .env
# Edit .env:
#   - Generate LETTER_ENCRYPTION_KEY: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
#   - Add ANTHROPIC_API_KEY if you want live AI prompt personalization
#     (without it, the app falls back to the static Gray-format templates —
#     still fully functional, just not personalized)
#   - Set a real JWT_SECRET_KEY before deploying anywhere public

uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive API docs.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
backend/
  app/
    main.py           # FastAPI app, CORS, router wiring
    models.py         # User, Letter, PromptTemplate, MoodLog
    schemas.py         # Pydantic request/response models
    auth.py            # JWT + bcrypt (direct, not passlib — see note below)
    encryption.py       # Fernet encrypt/decrypt for letter content at rest
    prompts.py          # Static Anger/Hurt/Fear/Regret/Love template data
    ai.py               # Claude API call + fallback to static templates
    routers/
      auth_routes.py
      prompt_routes.py
      letter_routes.py  # includes /letters/resurfaced logic
      mood_routes.py

frontend/
  app/
    page.tsx                 # Landing
    login/, signup/          # Auth pages
    dashboard/                # Resurfaced letters + entry points
    write/                    # Guided 5-stage writing flow
    letters/                  # List + detail (unfold animation)
  lib/
    api.ts                   # Backend API client
    auth-context.tsx          # Token/user state, persisted to localStorage
  components/
    EnvelopeCard.tsx
```

## Known technical notes

- **bcrypt**: `passlib`'s bcrypt backend has a known version-compatibility bug
  in newer environments. Auth uses the `bcrypt` package directly instead —
  more reliable, one less dependency layer.
- **Next.js version**: pinned to `14.2.35`, the final officially patched
  release on the 14.x line (per Next.js's Dec 2025 security advisories).
  A few lower-severity advisories only resolve on Next 16 (a breaking major
  upgrade) — worth doing after Aug 1, not before, so a version jump doesn't
  eat your remaining time.
- **Encryption key**: `LETTER_ENCRYPTION_KEY` auto-generates a throwaway key
  if unset, purely so local dev doesn't crash. Set a real one before any
  shared/deployed environment — letter content is otherwise unrecoverable
  or (worse) trivially decryptable if the key resets.
- **Resurfacing window**: hardcoded to 30 days (`RESURFACE_AFTER_DAYS` in
  `letter_routes.py`). Fine for now — for a demo/hackathon you'll want a much
  shorter window (e.g. 2 minutes) to actually show the feature working.

## Suggested day-by-day plan to Aug 1

You have ~12 days. This scaffold gets you a working local MVP on day 1 —
here's how I'd spend the rest:

**Days 1-2**: Get both servers running locally, walk the full flow yourself
(signup → write a full 5-stage letter → see it in the list → open it). Fix
anything that breaks in your actual environment (Windows path issues, etc.)

**Days 3-5**: Polish the writing flow — this is your core differentiator.
Consider: saving drafts mid-flow (currently only saves at the end), a
progress indicator that doesn't lose work on refresh, better mobile layout
for the stage cards.

**Days 6-7**: Deploy. Given your StockSense AI setup, you already know this
part: FastAPI → Render, Next.js → Vercel. Swap SQLite for Postgres before
deploying (Render's free Postgres tier works fine for this scale).

**Days 8-9**: Shorten the resurfacing window for demo purposes, test it
actually surfaces old letters correctly, add basic empty/error states you
haven't hit yet.

**Days 10-11**: Buffer for whatever breaks during deployment (something
always does) + basic mobile responsiveness pass.

**Day 12**: Rest, or write your build-in-public post about it.

## What's not built yet (by design, to keep MVP scope tight)

- Password reset / email verification
- Partner-sharing (this MVP is single-user private letters only, per your
  "general public" scope decision — sharing is a meaningfully bigger trust/
  consent surface, worth doing as a deliberate v2 rather than bolted on now)
- Mood/wave tracking has backend routes (`/moods`) but no frontend UI yet —
  quick to add if you want the "wave" chart before Aug 1
