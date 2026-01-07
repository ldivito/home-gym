# Home Gym Tracker

A PWA for tracking home gym workouts and progress.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Deployment**: Vercel

## Requirements

- Node.js 20+
- pnpm 10+
- Docker (for local development) or PostgreSQL database (Neon for production)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up the database

#### Option A: Local Docker (Recommended for development)

Start the PostgreSQL container:

```bash
docker-compose up -d
```

Copy the example env file (already configured for Docker):

```bash
cp .env.example .env.local
```

#### Option B: Neon (For production or remote development)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string from the dashboard
4. Create `.env.local` and set:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply migrations to database |
| `pnpm db:studio` | Open Drizzle Studio (DB GUI) |

## Project Structure

```
src/
├── app/
│   ├── (features)/     # Feature route groups (add features here)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── providers.tsx   # React Query provider
├── components/
│   ├── ui/             # shadcn/ui components
│   └── header.tsx      # App header
├── db/
│   ├── migrations/     # Drizzle migrations
│   └── schema/         # Database schema definitions
├── features/           # Feature modules (add business logic here)
└── lib/
    ├── db.ts           # Database connection
    ├── env.ts          # Environment validation
    └── utils.ts        # Utility functions
```

## Adding Features

This project uses a feature-first architecture:

1. **Routes**: Add new pages in `src/app/(features)/your-feature/`
2. **Logic**: Add business logic in `src/features/your-feature/`
3. **Schema**: Add database tables in `src/db/schema/`

## PWA

The app is configured as an installable PWA:

- Manifest: `/public/manifest.json`
- Service Worker: `/public/sw.js`
- Icons: `/public/icon-192.png`, `/public/icon-512.png`

To regenerate icons:

```bash
node scripts/generate-icons.mjs
```

## License

Private
