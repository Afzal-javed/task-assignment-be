# Project: Task Management Dashboard (Backend)

## Architecture
- **Feature-first, class-based architecture** (Controller -> Service -> Repository -> Module).
- **SOLID principles** followed for maintainability.
- **Dependency Inversion** implemented with service/repository interfaces.

## Technology
- **Node.js 20+**
- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**

## Conventions
- **Feature Structure:** Each feature (auth, tasks, dashboard) lives in `src/features/<feature_name>/` and contains:
  - `controllers/` (HTTP handlers)
  - `services/` (Business logic)
  - `repositories/` (Database access)
  - `routes/` (Route definitions + Swagger)
  - `dto/` (Zod schemas & response types)
  - `middleware/`
  - `module.ts` (Dependency injection)
- **Shared Code:** Common utilities, exceptions, middleware, and validators are in `src/shared/`.
- **Validation:** Use **Zod** for request validation at the API boundary.
- **Testing:** Integration tests (planned) using **Jest + Supertest + MongoDB Memory Server**.

## Commands
- `npm run dev`: Development mode
- `npm run build`: Build for production
- `npm run start`: Run production build
- `npm run lint`: Lint code
- `npm test`: Run tests
