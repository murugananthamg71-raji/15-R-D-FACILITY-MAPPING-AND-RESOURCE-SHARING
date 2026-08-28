# R&D Resource Portal API

Backend-only Express and PostgreSQL API for the Departmental R&D Facility Mapping and Resource Sharing Portal.

## Installation

```bash
cd bacend
npm install
cp .env.example .env
```

Set a real PostgreSQL connection string and a strong `JWT_SECRET` in `.env`. Do not commit `.env`.

## PostgreSQL setup

Create the database and apply the schema:

```bash
createdb rd_resource_portal
psql -d rd_resource_portal -f database/schema.sql
psql -d rd_resource_portal -f database/seed.sql
psql -d rd_resource_portal -f database/laboratory_migration.sql
psql -d rd_resource_portal -f database/laboratory_seed.sql
psql -d rd_resource_portal -f database/laboratory_seed_eee_equipment.sql
psql -d rd_resource_portal -f database/official_it_laboratories.sql
```

If `schema.sql` reports that the database already exists, continue with the table statements while connected to `rd_resource_portal`; the first `CREATE DATABASE` line is intended for a fresh setup workflow.

The schema enforces the five department codes: `IT`, `CSE`, `ECE`, `EEE`, and `MECH`.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection URL
- `JWT_SECRET`: secret used to sign JWTs
- `PORT`: server port, default `5000`
- `CORS_ORIGIN`: allowed frontend origin, default `http://localhost:8000`

## Start server

```bash
npm start
# development
npm run dev
```

API base URL: `http://localhost:5000/api`

Health check: `GET http://localhost:5000/api/health`

The health endpoint checks PostgreSQL and returns HTTP 503 when the database is unavailable. It does not fake a healthy response.

## Authentication

Register and login responses return a JWT and a public user object without `password_hash`. Send the token on protected requests:

```http
Authorization: Bearer <token>
```

### Demo accounts

All demo accounts use password `123456`:

- Student: `student@college.edu`
- Faculty: `faculty@college.edu`
- Admin: `admin@college.edu`

These are demonstration credentials only.

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/departments`
- `GET /api/departments/:id`
- Admin department `POST`, `PUT`, `DELETE`
- `GET /api/facilities` with `department`, `availability`, and `search`
- `GET /api/facilities` also supports `semester`, `regulation`, `course_code`, and `type` for laboratories
- `GET /api/facilities/:id` returns its linked equipment inventory; authorized `POST`, `PUT`, `DELETE`
- `GET /api/equipment` with `department`, `category`, `availability`, `search`, and `lab_id`
- `GET /api/equipment/:id`; authorized `POST`, `PUT`, `DELETE`
- `GET /api/expertise` with `search`; admin/faculty `POST`, `PUT`, `DELETE`
- Authenticated `POST`, `GET`, `GET /:id`, `PUT /:id/status`, and `DELETE` on `/api/requests`
- `GET /api/dashboard/stats`
- `GET /api/resources/search?q=robotics`

Laboratory course records use the existing `facilities` endpoint. Equipment records are linked with `lab_id`, and detail responses include `required_quantity`, `available_quantity`, generated non-negative `deficiency`, and `unit`.

All successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": ... }`.

## Frontend connection

The existing static frontend runs at `http://localhost:8000`. Configure frontend API calls to use `http://localhost:5000/api` and send the returned bearer token for protected endpoints. No frontend files are modified by this backend.
