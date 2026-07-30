# Love Letters

A private, guided letter-writing app inspired by John Gray's "Private Session" concept in *Men Are from Mars, Women Are from Venus*. AI-personalized prompts walk you through the Anger, Hurt, Fear, Regret, Love format from the book. Letters are encrypted at rest and quietly resurface weeks later, so you can see how you feel now versus then.

**Live app**: [love-letters-1511.vercel.app](https://love-letters-1511.vercel.app)
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

## Screenshot

<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/513fa101-3d5b-415c-b32d-dbb7ad3e4017" />

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

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Project structure
