# Chicago Housing Helper

A free web application to help Chicago residents discover subsidized housing programs they may qualify for. The app provides a questionnaire-based eligibility check against 1,100+ housing programs from multiple data sources.

## Features

- **Eligibility Wizard** - Simple questionnaire to determine program eligibility
- **1,141 Housing Programs** - Data from HUD, Chicago Data Portal, and CHA
- **Daily Data Sync** - Automated updates via GitHub Actions
- **AI-Powered CHA Agent** - Uses Claude to autonomously extract CHA waitlist data
- **Paginated Results** - Search and filter by neighborhood, program type
- **Document Checklist** - Track required documents for applications

## Project Structure

```
chicago-housing-helper/
├── apps/
│   └── web/                     # Next.js 16 frontend application
│       ├── src/app/             # App router pages
│       └── src/lib/             # Matching engine
├── packages/
│   └── database/                # Prisma schema & data sync
│       ├── prisma/              # Schema definition
│       ├── src/sync/            # Data sync scripts
│       └── src/services/        # API integrations (HUD, CHA Agent)
├── .github/workflows/           # Daily sync automation
└── package.json                 # Root scripts
```

## Data Sources

| Source | Records | Update Frequency |
|--------|---------|------------------|
| **HUD Income Limits** | 16 | Daily (fallback: static 2024/2025) |
| **Chicago Data Portal** | 598 | Daily |
| **CHA Waitlists** | 547 | Daily (AI-powered extraction) |
| **Total** | **1,141** | |

## Getting Started

### Prerequisites

- Docker and Docker Compose (for dev container)
- pnpm 9+ (if running locally without Docker)
- Node.js 22+

### Development with Dev Container (Recommended)

1. Open this folder in VS Code
2. Install the "Dev Containers" extension
3. Press `Cmd/Ctrl + Shift + P` → "Dev Containers: Reopen in Container"
4. Wait for the container to build and dependencies to install
5. Copy environment file and add your API keys:

   ```bash
   cp .env.example .env
   ```

6. Run database setup:

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

7. Sync real data (requires environment variables):

   ```bash
   export $(grep -v '^#' .env | xargs) && pnpm db:sync
   ```

8. Start the dev server:

   ```bash
   pnpm dev
   ```

9. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file with the following:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/housing_navigator

# For HUD Income Limits (optional - has static fallback)
HUD_API_TOKEN=your_hud_api_token

# For CHA Agent (required for CHA data sync)
ANTHROPIC_API_KEY=sk-ant-...
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web app dev server |
| `pnpm build` | Build web app for production |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:seed` | Seed database with initial data |
| `pnpm db:studio` | Open Prisma Studio GUI |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:sync` | Run all data syncs (HUD, Chicago, CHA) |
| `pnpm db:sync:hud` | Sync HUD income limits |
| `pnpm db:sync:chicago` | Sync Chicago Data Portal |
| `pnpm db:sync:cha` | Sync CHA waitlists (AI agent) |

### Running Syncs Locally

Environment variables must be exported before running syncs:

```bash
# Export all variables and run sync
export $(grep -v '^#' .env | xargs) && pnpm db:sync

# Or run individual syncs
export $(grep -v '^#' .env | xargs) && pnpm db:sync:cha
```

## CHA Autonomous Agent

The CHA sync uses an AI agent (Claude) to autonomously extract waitlist data:

1. **Discovery** - Finds XLS files on CHA website
2. **Analysis** - Understands spreadsheet structure
3. **Extraction** - Extracts data using learned column mappings
4. **Validation** - Quality checks before saving

The agent can adapt to format changes without code updates.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **Database**: PostgreSQL 16 + Prisma ORM
- **AI**: Vercel AI SDK + Anthropic Claude
- **Deployment**: Vercel (recommended)

## GitHub Actions

The daily sync workflow runs at 6:00 AM UTC and syncs all data sources. Required secrets:

- `DATABASE_URL`
- `HUD_API_TOKEN`
- `ANTHROPIC_API_KEY`

## License

MIT
