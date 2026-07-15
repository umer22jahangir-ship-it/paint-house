# Aftab Malik Paint House

A modern, responsive website for a car paint color matching business. Built with Next.js (React), Tailwind CSS, and SQLite.

## Features

- **Home Page** — Hero section, business intro, service highlights, AI assistant
- **Paint Finder** — Search paint matches by car company, model, and year
- **AI Paint Assistant** — Rule-based chatbot (upgradeable to real LLM later)
- **Gallery** — Placeholder image grid for workshop and paint samples
- **Services** — Full service listing with descriptions
- **Contact** — WhatsApp, phone, map, and contact form
- **Dark/Light Theme** — Toggle with system preference fallback
- **WhatsApp CTA** — Floating button on every page

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (SQLite)
- [Lucide React](https://lucide.dev/) (icons)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Allow native build scripts (required for better-sqlite3)
npm approve-scripts better-sqlite3

# Seed the database with sample car/paint data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run db:seed
npm run build
npm start
```

## Configuration

Edit `lib/config.ts` to update business details:

- Phone number and WhatsApp number
- Email and physical address
- Google Maps embed URL
- Site name and description

## Database

The SQLite database (`paint_house.db`) is created by the seed script.

### Tables

| Table | Purpose |
|-------|---------|
| `Cars` | Vehicle company, model, year |
| `Colors` | Paint color name and code per car |
| `PaintAvailability` | Imported/China paint stock per color |
| `Leads` | Contact form submissions |

### Adding More Data

Edit `scripts/seed-db.js` to add more cars, colors, and availability records, then run:

```bash
npm run db:seed
```

For production, consider migrating to PostgreSQL/MySQL — the `lib/db.ts` layer is designed to be swapped out.

## Project Structure

```
app/
  api/          # API routes (paint search, chat, contact)
  paint-finder/ # Paint Finder page
  services/     # Services page
  gallery/      # Gallery page
  contact/      # Contact page
components/
  ui/           # Reusable UI (Button, Card, Input, etc.)
  layout/       # Header, Footer, WhatsApp, Theme
  home/         # Home page sections
  paint-finder/ # Paint Finder form & results
  chat/         # AI assistant widget
  contact/      # Contact form
lib/
  config.ts     # Site configuration
  db.ts         # Database queries
  types.ts      # TypeScript types
  whatsapp.ts   # WhatsApp URL helpers
  chat-assistant.ts  # AI assistant logic (swap for LLM later)
scripts/
  seed-db.js    # Database setup & seeding
public/
  (static assets)
components/ui/
  Logo.tsx      # React SVG logo (LogoMark + wordmark)
```

## Future Scalability

- **More car models** — Add rows to seed script or build an admin dashboard
- **More paint brands** — Extend `PaintAvailability` table with brand columns
- **AI assistant** — Replace `lib/chat-assistant.ts` with OpenAI/Anthropic API
- **Admin dashboard** — Add `/admin` routes using the same database layer

## License

Private — All rights reserved.
