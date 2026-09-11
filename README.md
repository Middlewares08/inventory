# Inventory & Monitoring (PERN Stack)

Inventory and monitoring system built on PostgreSQL, Express, React (Vite), and Node.
The `frontend` and `backend` are separate apps with their own `package.json`.

```
.
├── backend/    Express API + PostgreSQL access + migrations
└── frontend/   React app (Vite)
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL 13+ running locally (or a connection string to a hosted instance)

## 1. Create the database

```sh
psql -U postgres -c "CREATE DATABASE inventory;"
```

## 2. Backend setup

```sh
cd backend
npm install
copy .env.example .env   # then edit .env with your PostgreSQL credentials
```

Run the schema migration:

```sh
npm run migrate:up
```

Start the API in dev mode (auto-restarts on file changes):

```sh
npm run dev
```

The API listens on `http://localhost:5000` by default. Check `http://localhost:5000/api/health` to confirm it's up and connected to PostgreSQL.

### Authentication

The `create-users` migration seeds a default admin account:

- Email: `admin@example.com`
- Password: `ChangeMe123!`

Log in via `POST /api/auth/login` (used by the frontend login page) to receive a JWT. All `/api/items` routes require `Authorization: Bearer <token>`. Use `POST /api/auth/register` (itself authenticated) to create additional accounts. **Change or remove the default admin before deploying anywhere real.**

### Backend scripts

| Command                | Description                              |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the API with nodemon                |
| `npm start`             | Start the API                             |
| `npm run migrate:up`    | Apply all pending migrations              |
| `npm run migrate:down`  | Roll back the last migration              |
| `npm run migrate:create <name>` | Scaffold a new migration file     |

## 3. Frontend setup

```sh
cd frontend
npm install
copy .env.example .env   # defaults to http://localhost:5000/api
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend via `VITE_API_URL`.

## Environment variables

Both apps load configuration from a local `.env` file (never committed — see `.env.example` in each folder for the variables to set).

- `backend/.env.example` — PostgreSQL connection details, server port, CORS origin, JWT secret/expiry
- `frontend/.env.example` — `VITE_API_URL`, the backend API base URL

## Database schema

The migrations in `backend/migrations/` create:

- `categories` — item categories
- `items` — inventory items (SKU, quantity, location, reorder level, category)
- `stock_movements` — a log of quantity changes per item, used for monitoring stock over time
- `users` — login accounts (seeded with a default admin, see Authentication above)

Add new tables/columns with `npm run migrate:create <name>` inside `backend/`, then implement `up`/`down` in the generated file.
