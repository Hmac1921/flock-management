# API client notes

- Endpoints are typed via `openapi-fetch` using the `Paths` interface in `client.ts`. Replace that interface with generated types when your OpenAPI spec is ready (e.g. `openapi-typescript https://... --output src/api/schema.d.ts` and `import type { paths as ApiPaths } from './schema'`).
- Both `getHealth` and `getDbCheck` throw `ApiError` with status/message for TanStack Query error states.
- Base URL comes from `VITE_BASE_URL` in `.env` and is enforced at startup.
