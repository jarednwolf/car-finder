# Option‑Aware Car‑Match Web App  
_A Conversational LLM assistant + Real‑time option‑level inventory alerts_

**GitHub Repository:** https://github.com/jarednwolf/car-finder

---

## 1. Product Overview

1. **Chat‑to‑Match (LLM):** A customer speaks with an OpenAI‑powered chatbot that asks guided questions (budget, body‑style, options, brand biases, climate needs, etc.) and suggests best‑fit models in real time.  
2. **Profile & Alerts:** When the user clicks **"Save these preferences"**, the system stores a structured `Preference` object in Postgres (pgvector) and spins up a background job that scans U.S. listings for cars matching those specs.  
3. **Notifications:** Matching cars are pushed via e‑mail/SMS and shown on a personal dashboard.

---

## 2. High‑Level Architecture

```
Browser ──► React 18 (Chat UI + Dashboard)
                    │  websocket / REST
API Gateway ──► FastAPI 3.12
                    │
   ┌─────────Core Services───────────┐
   │ 1. Chat Service  (OpenAI proxy) │
   │ 2. Pref Extractor (LLM JSON)    │
   │ 3. Ingest & Enrich (Celery)     │
   │ 4. Recommender (pgvector)       │
   │ 5. Notifier  (SES/Twilio)       │
   └─────────────────────────────────┘
                    │
     Postgres 15 + pgvector 0.6
         (Supabase-managed)
                    │
          Raw S3  ←  Lambda ingest
```

---

## 3. Key Components & Tech Choices

| Concern | MVP Stack | Scale Path |
|---------|-----------|-----------|
| **Chat / LLM** | OpenAI Chat Completions (`gpt-4o`) via FastAPI route `/chat` | Fine‑tune or RAG with private vector store |
| **Pref‑extraction** | OpenAI function‑calling → returns JSON schema `CarPreference` | Move to background task if latency matters |
| **Front‑end** | React 18 + Vite + Socket.IO | Next.js + Edge Functions |
| **Auth** | Supabase Auth (email‑link) | Auth0 / Cognito for SSO |
| **DB** | Supabase Postgres + pgvector | RDS Aurora Serverless v2 |
| **Task queue** | Celery + SQS | Kafka/Faust |
| **Listing feed** | Marketcheck & Auto.dev APIs + vPIC + VINAnalytics | Add DataOne, OEM feeds |

---

## 4. Data Models (simplified)

```mermaid
erDiagram
    USER ||--o{ CONVERSATION : has
    CONVERSATION ||--o{ MESSAGE : log
    USER ||--o{ PREFERENCE : owns
    PREFERENCE ||--o{ ALERT : triggers
    LISTING ||--o{ ALERT : matches

    USER { uuid id PK
           text email
           json settings }

    CONVERSATION { uuid id PK
                   uuid user_id FK
                   timestamp started_at }

    MESSAGE { uuid id PK
              uuid convo_id FK
              bool from_user
              text content
              timestamp ts }

    PREFERENCE { uuid id PK
                 uuid user_id FK
                 json car_pref  -- extracted JSON
                 vector emb }   -- pgvector(768)

    LISTING { text vin PK
              json attrs
              vector emb }

    ALERT { uuid id PK
            uuid pref_id FK
            text vin FK
            timestamp sent_at }
```

---

## 5. Local Dev Quick‑start

```bash
# Clone the repository
git clone https://github.com/jarednwolf/car-finder.git
cd car-finder

# Run setup script
bash scripts/setup.sh

# Edit .env and add your OpenAI API key (required)
nano .env  # or use your preferred editor

# Start the application
docker compose up --build

# Open the app
open http://localhost:5173

# (Optional) Run the E2E demo in another terminal
docker compose exec api python scripts/run_e2e_demo.py
```

For detailed API key setup, see `API_KEYS.md`

---

## 6. Environment Variables

```
OPENAI_API_KEY=
MARKETCHECK_API_KEY=
AUTODEV_API_KEY=
VINANALYTICS_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=postgres://...
REDIS_URL=redis://...
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_REGION=
TWILIO_SID=
TWILIO_TOKEN=
```

---

## 7. Testing & Linting

```bash
pytest -q
ruff check .
mypy app/
```

---

## 8. CI/CD

* **GitHub Actions** – run tests, build Docker, push to ECR  
* **Terraform** – Supabase, ECS Fargate, SQS, SES, CloudFront  
* **Blue/green deploy** – ECS task sets with automatic rollback on CloudWatch 5xx alarm.

---

## 9. Cost Estimate (100 MAU)

| Item | $/mo |
|------|------|
| Supabase (Pro) | 25 |
| OpenAI (chat + extract) | 40 |
| Marketcheck 50 k | 199 |
| Auto.dev 10 k | 50 |
| AWS (Lambda + Fargate + SQS + SES) | 60 |
| Twilio | 10 |
| **Total** | **≈ $384** |

Break‑even ≈ 26 users on $15 mo Pro tier.

---

## 10. License

MIT – third‑party data/API licences apply. 