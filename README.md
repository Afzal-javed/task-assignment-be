# TaskFlow — Backend API

Production-ready REST API for a **Task Management Dashboard**, built with Node.js, Express, TypeScript, MongoDB, Mongoose, and JWT authentication.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Complete Source Code Structure](#complete-source-code-structure)
4. [Architecture Decisions](#architecture-decisions)
5. [Assumptions](#assumptions)
6. [Environment Setup](#environment-setup)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Security](#security)

---

## Project Overview

This backend powers a full-stack task management application. It provides:

- **User authentication** — register, login, logout with JWT
- **Task management** — CRUD with pagination, search, filter, and sort
- **Dashboard metrics** — aggregated stats per user
- **User isolation** — every task is scoped to the authenticated user

The API follows a **feature-first, class-based architecture** with clear separation between controllers, services, and repositories (SOLID principles).

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js 4 | HTTP server & routing |
| TypeScript 5 | Type safety |
| MongoDB | Document database |
| Mongoose 8 | ODM & schema validation |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Winston | Structured logging |
| Helmet + CORS + Rate Limiting | Security |
| Jest + Supertest | Integration tests |
| Swagger | API documentation |

---

## Complete Source Code Structure

```
BE/
├── docs/
│   └── DATABASE_ARCHITECTURE.md    # MongoDB schema & indexing docs
├── postman/
│   └── Task-Management-API.postman_collection.json
├── scripts/
│   └── ensure-dist.js              # Auto-build for production deploy
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server bootstrap & graceful shutdown
│   ├── config/
│   │   ├── env.ts                  # Zod-validated environment variables
│   │   └── swagger.ts              # OpenAPI / Swagger spec
│   ├── database/
│   │   ├── connection.ts           # MongoDB connection with pooling
│   │   ├── validate-indexes.ts     # Index validation on startup
│   │   ├── interfaces/             # IUser, ITask document types
│   │   └── models/
│   │       ├── User.model.ts
│   │       ├── Task.model.ts
│   │       └── TokenBlacklist.model.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── controllers/        # HTTP handlers
│   │   │   ├── services/           # Business logic (Auth, JWT, Password)
│   │   │   ├── repositories/       # Database access
│   │   │   ├── routes/             # Route definitions + Swagger
│   │   │   ├── middleware/         # JWT auth middleware
│   │   │   ├── dto/                # Zod schemas & response types
│   │   │   ├── interfaces/         # Service & repository contracts
│   │   │   └── auth.module.ts      # Dependency injection wiring
│   │   ├── tasks/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── dto/
│   │   │   ├── interfaces/
│   │   │   └── tasks.module.ts
│   │   └── dashboard/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── dashboard.module.ts
│   └── shared/
│       ├── constants/                # HTTP status, enums, validation
│       ├── exceptions/               # Custom error classes
│       ├── middleware/               # Error handler, async wrapper, rate limit
│       ├── response/                 # Standardized API response formatter
│       ├── validators/               # Zod request validation middleware
│       └── logger/                   # Winston logger
├── tests/
│   ├── auth.test.ts                # Auth integration tests
│   ├── tasks.test.ts               # Task CRUD integration tests
│   ├── helpers.ts
│   └── setup.ts
├── .env.example
├── .node-version                   # Node 20 for deployment
├── render.yaml                     # Render.com deploy config
├── package.json
├── tsconfig.json
└── README.md
```

---

## Architecture Decisions

### 1. Feature-First Folder Structure

Code is organized by **domain feature** (`auth`, `tasks`, `dashboard`), not by technical layer. Each feature owns its controllers, services, repositories, DTOs, and routes. This improves maintainability and allows teams to work on features independently.

### 2. Class-Based Layered Architecture (SOLID)

| Layer | Responsibility | Rule |
|-------|----------------|------|
| **Controller** | HTTP request/response | No business logic, no DB calls |
| **Service** | Business rules & orchestration | No HTTP or DB driver code |
| **Repository** | Database queries | No business logic |
| **Module** | Dependency injection wiring | Instantiates and connects layers |

**Dependency Inversion:** Services depend on repository interfaces, not concrete implementations, enabling testability and swapping data sources.

### 3. References Over Embedding (MongoDB)

Users and tasks are **separate collections** linked by `userId` reference:

- Tasks can grow unboundedly without hitting MongoDB's 16 MB document limit
- Independent indexing on task fields (`status`, `dueDate`, text search)
- Efficient pagination without loading entire user documents

### 4. JWT with Token Blacklist

Authentication is **stateless JWT** for scalability. Logout uses a **MongoDB TTL blacklist collection** to revoke tokens before expiry without server-side sessions.

### 5. Zod Validation at API Boundary

All request bodies, query params, and route params are validated with **Zod schemas** before reaching controllers. Invalid requests return structured `400` errors with field-level messages.

### 6. Standardized API Response Envelope

Every response follows a consistent shape:

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 45 }
}
```

### 7. Security Middleware Stack

- **Helmet** — HTTP security headers
- **CORS** — configurable allowed origins
- **express-rate-limit** — global + auth-specific rate limiting
- **compression** — gzip response compression
- **bcrypt** — password hashing (12 salt rounds)

### 8. Database Indexing Strategy

| Collection | Index | Purpose |
|------------|-------|---------|
| users | `email` (unique) | Login, duplicate prevention |
| tasks | `userId` | List tasks per user |
| tasks | `userId + status` | Filter by status per user |
| tasks | `userId + dueDate` | Sort by due date per user |
| tasks | text(`title`, `description`) | Full-text search |

Indexes are validated on server startup via `validateIndexes()`.

---

## Assumptions

| # | Assumption | Rationale |
|---|------------|-----------|
| 1 | **Single-tenant per user** — each user only sees their own tasks | Standard SaaS task app; `userId` enforced on every query |
| 2 | **JWT access tokens only** — no refresh token rotation | Simplifies MVP; tokens expire in 1 day (`JWT_EXPIRES_IN=1d`) |
| 3 | **Email is the unique login identifier** | Enforced via unique MongoDB index |
| 4 | **Password min 8 characters** | Validated at API layer before bcrypt hashing |
| 5 | **Logout invalidates token server-side** | Token blacklist with TTL matching JWT expiry |
| 6 | **Task `dueDate` cannot be in the past on create** | Mongoose custom validator; updates may retain past dates |
| 7 | **Pending = `pending` + `in_progress`** for dashboard metrics | Business rule for "active" vs "completed" tasks |
| 8 | **MongoDB is the sole data store** | No Redis/cache layer; suitable for MVP scale |
| 9 | **API is consumed by a known frontend origin** | CORS configured via `CORS_ORIGIN` env variable |
| 10 | **English-only** text search on tasks | MongoDB text index default language |

---

## Environment Setup

### Prerequisites

- **Node.js** 20.x (see `.node-version`)
- **MongoDB** 6.0+ (local, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** 9+

### Step 1 — Clone & Install

```bash
git clone <repository-url>
cd BE          # or your backend repo root
npm install
```

### Step 2 — Environment Variables

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port (default 3000) | `9000` |
| `MONGODB_URI` | **Yes** | MongoDB connection string | `mongodb://localhost:27017/task_management_db` |
| `JWT_SECRET` | **Yes** | Min 32 characters | `your-super-secret-jwt-key-min-32-chars` |
| `JWT_EXPIRES_IN` | No | Token expiry | `1d` |
| `BCRYPT_SALT_ROUNDS` | No | bcrypt cost factor | `12` |
| `CORS_ORIGIN` | No | Allowed frontend origin(s) | `http://localhost:3001` |
| `LOG_LEVEL` | No | Winston log level | `info` |

### Step 3 — Start MongoDB

```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# macOS Homebrew
brew services start mongodb-community
```

---

## Running the Application

```bash
# Development (hot reload with nodemon + tsx)
npm run dev

# Type check
npm run typecheck

# Run tests
npm test

# Production build & start
npm run build
npm start
```

| Resource | URL (default port 9000) |
|----------|-------------------------|
| Health check | http://localhost:9000/health |
| Swagger docs | http://localhost:9000/api/docs |

---

## API Documentation

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Revoke JWT token |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | Yes | Total, completed, pending, completion % |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List tasks (paginated, searchable) |
| GET | `/api/tasks/:id` | Yes | Get task by ID |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id` | Yes | Update task |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

**Query params for `GET /api/tasks`:** `page`, `limit`, `status`, `search`, `sortOrder`

### Example — Register & Create Task

```bash
# Register
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"SecurePass123"}'

# Create task (use token from register/login response)
curl -X POST http://localhost:9000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Complete assignment","status":"pending"}'
```

Import `postman/Task-Management-API.postman_collection.json` for a full interactive collection.

---

## Testing

```bash
npm test              # Run all tests
npm run test:coverage # With coverage report
```

**Test stack:** Jest + Supertest + MongoDB Memory Server (in-memory DB, no external MongoDB needed for tests).

| Suite | Coverage |
|-------|----------|
| `auth.test.ts` | Register, login, logout, validation, duplicate email |
| `tasks.test.ts` | CRUD, search, filter, dashboard stats, auth guards |

---

## Deployment

### Render.com

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Node Version | `20` |

See `render.yaml` and `docs/RENDER_DEPLOYMENT.md` for details.

**Important:** Start command must be `npm start` (not `node dist/server.js` directly) so the `prestart` build hook runs if needed.

---

## Security

- Passwords hashed with **bcrypt** (never stored in plaintext)
- JWT secret minimum 32 characters (validated at startup)
- `passwordHash` excluded from API responses (`select: false`)
- Rate limiting on all routes; stricter limits on `/api/auth`
- Helmet security headers
- Input sanitization via Zod validation
- User-wise data isolation at repository layer

---

## License

MIT
