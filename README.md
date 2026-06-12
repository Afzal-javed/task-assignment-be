# Task Management Dashboard — Backend API

Production-ready REST API built with **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **Mongoose**, and **JWT** authentication.

## Features

- JWT-based authentication (register, login, logout with token blacklist)
- Full task CRUD with user-wise data isolation
- Pagination, search by title, filter by status, sort by `createdAt`
- Zod request validation with typed DTOs
- Class-based feature-first architecture (SOLID principles)
- Global error handler, async wrapper, structured API responses
- Winston logger, Helmet security, CORS
- Swagger/OpenAPI documentation
- Postman collection included

## Architecture

```
src/
├── config/           # Environment & Swagger configuration
├── database/         # MongoDB connection & Mongoose models
├── shared/           # Cross-cutting concerns (middleware, exceptions, logger)
├── features/
│   ├── auth/         # Authentication feature module
│   └── tasks/        # Task management feature module
├── app.ts            # Express app setup
└── server.ts         # Server bootstrap
```

Each feature follows:

```
feature/
├── controllers/    # HTTP request/response only
├── services/       # Business logic
├── repositories/   # Database access
├── routes/         # Route definitions + Swagger annotations
├── validators/     # (via shared/validators + feature dto/)
├── dto/            # Zod schemas & request/response types
└── interfaces/     # Contracts for DI & testing
```

## Prerequisites

- Node.js >= 18
- MongoDB >= 6.0 (local or Atlas)

## Quick Start

### 1. Install dependencies

```bash
cd BE
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
```

### 3. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 4. Run the server

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

Server starts at `http://localhost:3000`

## API Documentation

| Resource | URL |
|----------|-----|
| Swagger UI | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/health |

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| POST | `/api/auth/logout` | Yes | Revoke JWT token |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List tasks (paginated) |
| GET | `/api/tasks/:id` | Yes | Get task by ID |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id` | Yes | Update task |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

### Task Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | enum | — | Filter: `pending`, `in_progress`, `completed`, `cancelled` |
| `search` | string | — | Search by title (case-insensitive) |
| `sortOrder` | enum | `desc` | Sort by `createdAt`: `asc` or `desc` |

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title":"My first task","description":"Task details","status":"pending"}'
```

### List Tasks with Filters

```bash
curl "http://localhost:3000/api/tasks?page=1&limit=10&status=pending&search=report&sortOrder=desc" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Response Format

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Postman Collection

Import the collection from:

```
postman/Task-Management-API.postman_collection.json
```

The collection auto-saves the JWT token after register/login.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run typecheck` | Type-check without emitting |

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens with configurable expiry
- Token blacklist on logout (MongoDB TTL collection)
- Helmet HTTP security headers
- Input validation on all endpoints via Zod
- User-wise task isolation enforced at repository layer

## License

MIT
