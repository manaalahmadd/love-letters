# Love Letters

A private, guided letter-writing app inspired by John Gray's "Private Session" concept in *Men Are from Mars, Women Are from Venus*. AI-personalized prompts walk you through the Anger, Hurt, Fear, Regret, Love format from the book. Letters are encrypted at rest and quietly resurface weeks later, so you can see how you feel now versus then.

**Live app**: [love-letters-oy4o.vercel.app](https://love-letters-oy4o.vercel.app)
**API**: [love-letters-backend.onrender.com/docs](https://love-letters-backend.onrender.com/docs)

## Features

- Guided five-stage letter writing, with AI-personalized lead-in phrases based on your situation (falls back to static templates if no AI key is set)
- Letters encrypted at rest with Fernet, decrypted only for the owner
- Resurfacing: letters quietly reappear 30 days after writing, so you can reflect on how things have changed
- JWT auth, per-user private storage

## Stack

**Backend**: FastAPI, SQLAlchemy, PostgreSQL (Neon), JWT auth, Fernet encryption, Anthropic API for prompt personalization
**Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript

Deployed on Render (backend) and Vercel (frontend), with a free Neon Postgres instance for storage.

## Screenshots

*(add a screenshot or two here of the landing page and the write flow)*

## Getting started locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET_KEY, LETTER_ENCRYPTION_KEY
# ANTHROPIC_API_KEY is optional, without it prompts fall back to static templates

uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

App: `http://localhost:3000`

## Project structure

```
backend/
  app/
    main.py            # FastAPI app, CORS, router wiring
    models.py          # User, Letter, PromptTemplate, MoodLog
    schemas.py         # Pydantic request/response models
    auth.py            # JWT + bcrypt
    encryption.py      # Fernet encrypt/decrypt for letter content at rest
    prompts.py         # Anger/Hurt/Fear/Regret/Love template data
    ai.py              # Claude API call with fallback to static templates
    routers/
      auth_routes.py
      prompt_routes.py
      letter_routes.py   # includes resurfacing logic
      mood_routes.py

frontend/
  app/
    page.tsx                 # Landing
    login/, signup/          # Auth
    dashboard/                # Resurfaced letters + entry points
    write/                    # Guided five-stage writing flow
    letters/                  # List + detail view
  lib/
    api.ts                    # Backend API client
    auth-context.tsx          # Token/user state
  components/
    EnvelopeCard.tsx
```

## What's not built yet

- Password reset / email verification
- Partner-sharing (this is single-user private letters by design, sharing is a meaningfully bigger trust and consent surface, left for a deliberate v2)
- Mood/wave tracking has backend routes (`/moods`) but no frontend UI yet
