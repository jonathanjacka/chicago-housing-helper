---
description: Sync and enrich housing program data
---

# Data Sync Workflow

This workflow syncs data from external sources and enriches programs with LLM-generated information.

## Prerequisites
- Database running (`docker-compose up -d`)
- `ANTHROPIC_API_KEY` set in `.env`

## Full Data Sync (New Deployment)

Run these commands in order:

```bash
cd packages/database

# 1. Seed base data (programs, document requirements)
pnpm seed

# 2. Sync HUD income limits
pnpm sync:hud

# 3. Sync Chicago Data Portal (affordable housing properties)
pnpm sync:chicago

# 4. Geocode addresses (takes ~10 min, 1 req/sec rate limit)
pnpm sync:geocode

# 5. Enrich with LLM (takes ~20 min, finds website/application URLs)
pnpm sync:enrich
```

## Incremental Sync (Existing Data)

When new data is added, only un-enriched records are processed:

```bash
cd packages/database

# Sync new data from sources
pnpm sync:chicago

# Geocode only programs without coordinates
pnpm sync:geocode

# Enrich only programs without enrichedAt timestamp
pnpm sync:enrich
```

## Validate Links

Check for broken or irrelevant URLs:

```bash
cd packages/database

# Quick mode (HTTP check only)
pnpm sync:validate --quick

# Smart mode (HTTP + LLM analysis)
pnpm sync:validate

# Auto-fix broken links (clears for re-enrichment)
pnpm sync:validate --fix
```

## Force Re-enrichment

To re-enrich all programs (e.g., after prompt improvements):

```bash
cd packages/database
pnpm sync:enrich --force
```
