# Chicago Housing Helper

A free web application to help Chicago residents discover subsidized housing programs they may qualify for. Built as a monorepo with pnpm workspaces.

## Project Structure

```
chicago-housing-helper/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/app/         # App router pages
│       └── src/lib/         # Matching engine
├── packages/
│   └── database/            # Prisma schema & database client
│       ├── prisma/          # Schema definition
│       └── src/             # Exports & seed script
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root scripts
```

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
5. Run database setup:

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

6. Start the dev server:

   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Local Development (Without Docker)

1. Install pnpm:

   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy environment file:

   ```bash
   cp .env.example .env
   ```

4. Start PostgreSQL:

   ```bash
   docker run -d --name housing-db -p 5432:5432 \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=housing_navigator \
     postgres:16
   ```

5. Set up the database:

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

6. Start the dev server:

   ```bash
   pnpm dev
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

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Database**: PostgreSQL 16 + Prisma ORM
- **Deployment**: Vercel (recommended)

## Data Sources

- HUD FY 2024 Income Limits for Chicago metro area
- Chicago Housing Authority public data
- City of Chicago ARO units
- Local non-profit housing providers

## License

MIT
