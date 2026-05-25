# 🌿 Velune — Social Nutrition RPG

> *Grow your world through nutrition*

Velune is a full-stack cross-platform social nutrition RPG. It combines nutrition tracking, social media, gamification, RPG progression, mascots, collectibles, battles, and community interaction into a cozy fantasy-themed wellness app.

---

## ✨ Features

- **Nutrition Blueprint** — Personalized calorie, macro, vitamin & mineral targets via Mifflin-St Jeor BMR
- **Nutrient Rings** — Animated glowing rings for calories, protein, vitamins, hydration, minerals & fiber
- **Food Logging** — Searchable food database backed by USDA FoodData Central API
- **Streak System** — Protein, hydration, vitamins, breakfast, balanced diet & logging streaks
- **XP & Leveling** — Dual XP (Lifestyle + Social), 100 levels with progressive scaling
- **Title System** — 16+ unlockable titles from beginner to legendary
- **Profile Garden** — Living scenery that grows with your nutrition habits
- **Mascot System** — Fox, bunny, dragon, blob or cat companions with reactive moods
- **Collectible Discovery** — Rare food spirits unlocked by eating exotic ingredients
- **Social Feed** — Achievement posts, recipe sharing, nutrition matches
- **Recipe World** — Upload, discover and save recipes with auto-calculated nutrition
- **Battle Arena** — 1v1 and group battles: protein, hydration, balanced diet challenges
- **Groups System** — Private groups with shared streaks and battles
- **Smart Recommendations** — AI-powered deficiency suggestions via OpenAI
- **Real-time** — Socket.IO for live battle updates and notifications

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animations | Framer Motion |
| Backend | Next.js API Routes + Node.js |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | Auth.js v5 (NextAuth) + Credentials + Google OAuth |
| Cache | Redis (Railway) via ioredis |
| Queue | BullMQ for scheduled tasks |
| Images | Cloudinary |
| Nutrition API | USDA FoodData Central |
| AI | OpenAI GPT-3.5 for recommendations |
| Charts | Recharts |
| State | Zustand |
| Real-time | Socket.IO |
| Hosting | Vercel (frontend) + Railway (backend/Redis) + Neon (DB) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Busypatata/velune.git
cd velune
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in all values in `.env`. Required:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — Run `openssl rand -base64 32`
- `REDIS_URL` — Redis connection string

Optional but recommended:
- `USDA_API_KEY` — Get free key at https://fdc.nal.usda.gov/api-key-signup.html
- `OPENAI_API_KEY` — For AI recommendations
- `CLOUDINARY_*` — For image uploads

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data (titles, collectibles, demo user)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `ara@velune.app` / `velune123`

---

## 📁 Project Structure

```
velune/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Seed data (titles, collectibles, foods)
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Auth endpoints
│   │   │   ├── meals/         # Meal CRUD
│   │   │   ├── nutrients/     # Food search (USDA)
│   │   │   ├── social/        # Posts, likes, friend requests
│   │   │   ├── recipes/       # Recipe management
│   │   │   ├── battles/       # Battle system
│   │   │   ├── notifications/ # Notification system
│   │   │   ├── onboarding/    # Blueprint creation
│   │   │   └── users/         # User management
│   │   ├── auth/              # Login, signup pages
│   │   ├── dashboard/         # All main app pages
│   │   │   ├── page.tsx       # Home dashboard
│   │   │   ├── log/           # Food journal
│   │   │   ├── social/        # Blossom feed
│   │   │   ├── recipes/       # Recipe world
│   │   │   ├── battle/        # Battle arena
│   │   │   ├── profile/       # Profile garden
│   │   │   ├── collectibles/  # Discovery chest
│   │   │   └── notifications/ # Notifications
│   │   └── onboarding/        # First-time setup
│   ├── components/
│   │   ├── battle/            # Battle components
│   │   ├── food/              # Food logging components
│   │   ├── home/              # Dashboard components
│   │   ├── layout/            # Sidebar, TopBar
│   │   ├── mascot/            # Mascot card
│   │   ├── modals/            # Meal modal, nutrient detail
│   │   ├── profile/           # Profile garden, collectibles
│   │   ├── social/            # Feed, recipes
│   │   └── ui/                # Rings, XP bar, particles
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # DB client singleton
│   │   ├── redis.ts           # Redis client + cache helpers
│   │   ├── cloudinary.ts      # Image upload helpers
│   │   ├── usda.ts            # USDA API integration
│   │   ├── nutrition.ts       # BMR, macro calculations
│   │   ├── gamification.ts    # XP, streaks, titles, garden
│   │   └── ai.ts              # OpenAI recommendations
│   ├── store/
│   │   └── appStore.ts        # Zustand global state
│   ├── styles/
│   │   └── globals.css        # Tailwind + Velune design system
│   └── types/
│       └── index.ts           # All TypeScript types + XP system
└── ...config files
```

---

## 🎨 Design System — Moon Garden Fantasy

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Soft Sage Green | `#8FBF9F` |
| Secondary | Misty Lavender | `#B7A7D9` |
| Accent | Peach Glow | `#FFB997` |
| Highlight | Mint Glow | `#B8F2D0` |
| Background | Warm Cream | `#F7F4ED` |
| Alert | Glowing Coral | `#E07A7A` |
| XP Bar | Magical Lavender | `#BDB2FF` |

### Nutrient Colors
- 🔥 Calories: `#FFD166`
- 💪 Protein: `#F4978E`
- 🌈 Vitamins: `#C8B6FF`
- 💧 Hydration: `#7BDFF2`
- 🌿 Minerals: `#95D5B2`
- 🌾 Fiber: `#FFCB77`

---

## 🗄 Database

The schema includes:
- **Users** — Auth, profile, privacy settings
- **NutritionBlueprint** — Personalized targets per user
- **FoodItem** — Nutrition data (seeded + USDA cache)
- **Meal / MealFood** — Daily food logging
- **DailyLog** — Aggregated daily nutrition totals
- **Streak** — 6 streak types per user
- **Title / UserTitle** — Gamification titles
- **Collectible / UserCollectible** — Rare food spirits
- **GardenElement** — Profile garden unlocks
- **UserMascot** — Companion system
- **Recipe** — Community recipes
- **Post / Like / Comment** — Social feed
- **FriendRequest / Friendship** — Chummy Me system
- **Battle** — Competitive battles
- **Group / GroupMember** — Community groups
- **Notification** — Personal + social notifications
- **XPLog** — XP history

---

## 🔒 Environment Variables Reference

```env
# Required
DATABASE_URL=             # Neon PostgreSQL
AUTH_SECRET=              # openssl rand -base64 32
REDIS_URL=                # Redis connection

# Auth providers (optional)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Services (optional but enhance experience)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
USDA_API_KEY=             # https://fdc.nal.usda.gov/api-key-signup.html
OPENAI_API_KEY=           # For AI recommendations
```

---

## 🌐 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```
Set all environment variables in Vercel dashboard.

### Railway (Redis + optionally backend)
- Create Redis service on Railway
- Copy `REDIS_URL` to your `.env`

### Neon (Database)
- Create project at neon.tech
- Copy connection string as `DATABASE_URL`
- Run `npm run db:push` and `npm run db:seed`

---

## 📝 License

MIT © Velune
