# LeadRelay

<p align="center">
  <img src="docs/portfolio/leadrelay-banner.jpg" alt="LeadRelay — a customer writes in Telegram, a scored lead lands in your CRM" width="720">
</p>

> **A customer writes once. Your manager opens the chat and the lead is already there — phone number, problem, urgency. The CRM gets the same lead a second later. Nobody types anything twice.**

[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![aiogram](https://img.shields.io/badge/aiogram-3.x-2CA5E0?logo=telegram&logoColor=white)](https://aiogram.dev)
[![Tests](https://img.shields.io/badge/tests-336%20passed-brightgreen)](#numbers-that-dont-need-adjectives)
[![Typing](https://img.shields.io/badge/mypy-strict-blue)](#development-discipline-what-your-purchase-rests-on)
[![Ruff](https://img.shields.io/badge/ruff-clean-261230?logo=ruff&logoColor=white)](#development-discipline-what-your-purchase-rests-on)
[![Docker](https://img.shields.io/badge/deploy-one%20command-2496ED?logo=docker&logoColor=white)](#deployment--one-command)
[![License](https://img.shields.io/badge/license-commercial-success)](#license)

**LeadRelay** is a Telegram intake bot for service teams. A customer answers a few guided questions, your manager receives a scored lead card, and a delivery worker hands the request to your CRM — signed, retried and confirmed. **Nobody copy-pastes anything.**

*Built for:* home services, clinics, real estate, agencies — any team that takes enquiries in Telegram and works them elsewhere.
*Ships with:* 7 ready industry presets — pick the one closest to your business, edit the questions, done.

[▸ Read the client presentation (EN)](docs/portfolio/Bot%20Presentation.pdf) · [▸ Презентация для клиента (RU)](docs/portfolio/Презентация%20Бота.pdf) · [▸ One lead, start to finish — the case study](docs/portfolio/LeadRelay-case-study.pdf)

---

> **This is the showcase.** The full source — 11,238 lines of typed Python, 336 automated tests, Docker deploy — is delivered **with a commercial license** to clients on purchase. Ask below.

---

## What it replaces

**Today:** a customer messages the team. A manager calls back to ask *who, where, what exactly*. Someone types the phone into the CRM by hand — or doesn’t — and the lead cools off while it waits.

**With LeadRelay:** the customer taps four buttons. The manager opens a card with the phone number and the urgency already on it — presses *Take*, presses *Reply*, done. The CRM receives the same lead, every field filled, without anyone typing a word.

That is the whole product: **the lead arrives before the callback does.**

---

## What you get

| | You get | Why your team cares |
|---|---|---|
| 🎯 | **Guided intake form** — your questions, your services, your hours | The manager knows what happened before the first call |
| 🔥 | **Scoring — hot / warm / cold**, by your rules | The urgent ones get called first, every time, by whoever is on shift |
| 📨 | **Transactional outbox delivery** — retries with backoff, idempotent connectors | A dead CRM delays the lead, it never loses it |
| 🔐 | **AES-256-GCM per-field encryption** + blind indexes + encrypted backups | The customer’s phone is never stored in readable form — anywhere |
| 👥 | **Team inbox** — lead cards with Take / Contacted / Won / Lost / Spam | Everyone sees who owns the lead; two managers never call the same customer |
| 🌍 | **3 languages (ru / en / es)** + 7 industry presets | One bot serves your whole customer base |
| 🐳 | **One-command Docker deploy** — healthchecked, non-root, data on your disk | `./deploy.sh` and it is running. That is the whole ritual. |

---

## Numbers that don’t need adjectives

| | |
|---|---|
| **336** | automated tests — unit, integration and end-to-end — run on every push |
| **12** | integrations, each switched on by filling in its `.env` block |
| **11 238** | lines of typed source, checked by **mypy strict** |
| **4 438** | lines of test code that keep the source honest |
| **3** | database migrations, applied automatically on every start |
| **0** | `TODO` markers in the source — nothing shipped half-written |

The same **transactional outbox pattern** that payment systems use to move money — because a lost lead costs like a lost payment.

---

## Integrations

Your stack is probably already on this list:

| | | | |
|---|---|---|---|
| HubSpot | Salesforce | Pipedrive | Zoho CRM |
| GoHighLevel | Bitrix24 | amoCRM / Kommo | RetailCRM |
| Google Sheets | Slack | e-mail (SMTP) | webhook — Zapier / Make / n8n |

If your CRM is briefly offline, the lead waits in the outbox and lands on its own — retries back off up to an hour, nothing duplicates (upserts + idempotency keys). Teams that live in a spreadsheet get Google Sheets.

---

## Security by design

Personal data is other people’s data — the design treats it that way:

* **Field-level encryption.** Every name, phone and e-mail is an AES-256-GCM token with its own nonce, authenticated with the column name as associated data — a value copied into another table fails to decrypt instead of leaking.
* **Key separation.** HKDF-SHA256 derives independent keys for fields, blind indexes and backups; leaking one exposes only that one use.
* **Blind indexes.** Duplicate detection runs on HMAC — a phone number is never stored in a searchable readable form.
* **Encrypted streaming backups**, zero-downtime key rotation, `/privacy` self-service deletion for customers.

Full policy and the reasoning behind each decision: [SECURITY.md](SECURITY.md).

---

## Deployment — one command

Delivered source ships with a `deploy.sh`: it generates the encryption key on first run, validates the environment, builds the Docker image, starts the bot in the background and waits for the health check. Database, backups and logs stay on your disk; the container runs as a non-root user. Your part after purchase: `./deploy.sh` — that is the whole ritual.

In webhook mode the container listens on `0.0.0.0:8080` (your reverse proxy in front); in polling mode it opens no ports at all.

---

## Architecture

```
Telegram ──> aiogram handlers ──> services ──> SQLAlchemy repositories ──> SQLite / PostgreSQL
                                      │
                                      └─> outbox ──> delivery worker ──> CRM / Sheets / Slack / SMTP / webhook
```

`bot/` (handlers, views, i18n) · `domain/` (lead, scoring, validation) · `services/` (leads, delivery, backup, retention, analytics) · `integrations/` (8 CRM connectors, 4 sinks, AI) · `security/` (crypto, redaction) · `db/` (models, Alembic migrations).

Async end to end (uvloop), structured logging (structlog), one process — bot, delivery worker and scheduler together.

## Built with

Python 3.12 · aiogram 3 · SQLAlchemy 2 (async) · Alembic · Pydantic 2 · httpx · cryptography · phonenumbers · structlog · uvloop

## Development discipline (what your purchase rests on)

Every delivered release passes the same gates before it reaches you: **ruff** lint clean, **mypy strict** — no issues across 140 files, **336 automated tests** green (unit, integration, end-to-end), and the offline demo run from a clean checkout. CI enforces all of it on every commit.

## Changelog & history

Every change is versioned and dated, with the reasoning — you always know what changed in your delivery and why.

## License

**Commercial license, delivered on purchase.** The showcase (this repository) is public; the source is not open-source. Buying gets you the code, the deploy scripts and the license to run it for your business.

---

## Custom setup for your business

The bot is ready out of the box; your questions and your CRM mapping are the part worth doing *exactly* right.

I take a limited number of custom setups per month: your services and hours in the form, your CRM fields mapped, your team walked through claiming a lead, source code and one-command deploy in your hands. **Send me the name of your CRM and one typical enquiry — within a day I’ll reply with the first questions for your form.**

Say hi on GitHub — [@Liviathan11](https://github.com/Liviathan11). Worst case, you get a free read of how an experienced developer sees your intake flow.