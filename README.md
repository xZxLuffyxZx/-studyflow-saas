# StudyFlow — Student Assignment Tracker SaaS Demo

A single-workspace SaaS-style assignment planner built for the DIT312 Next.js + MySQL + Docker Compose assignment. Features: create, list, edit, delete, mark as completed, search/filter, priority/deadline management, and a dashboard of live MySQL counts.

> **Scope:** Classroom prototype. This demo does **not** include accounts, multi-tenancy, or authentication. Do not deploy as a public multi-user SaaS without adding them.

## Technology
- Next.js 16 (App Router) and React 19
- MySQL 8.4 through `mysql2/promise` (parameterized SQL queries)
- Docker multi-stage build and Docker Compose
- phpMyAdmin for visual database verification

## Requirements
- Docker Engine + Docker Compose plugin, or Docker Desktop
- Free ports **8080** (app) and **8081** (phpMyAdmin)

## Quick start (Docker)
1. Clone/download this repository and enter its folder.
2. Copy `.env.example` to `.env` and replace both demo passwords with your own values.
   - Windows PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
3. Run `docker compose up --build` (or `docker compose up` if previously built).
4. Wait for `web` and `mysql` to start, then open **http://localhost:8080**.
5. To inspect stored data, open **http://localhost:8081**. Log in using the `MYSQL_USER` and `MYSQL_PASSWORD` values from your `.env`; open the `studyflow` database and `tasks` table.
6. Stop with `Ctrl+C` and optionally `docker compose down`. **Do not use `-v`** if you want to preserve saved tasks.

Database initial sample tasks are inserted only on the **first start of a fresh MySQL volume**. If you alter `.env` database names or initialization SQL after first start, existing volumes are not automatically reinitialized.

## Demo steps (video)
1. Show the project folder with `Dockerfile`, `docker-compose.yml` and `mysql/init/01-schema.sql`.
2. Run `docker compose up --build` in a terminal and wait for services to start.
3. Visit `http://localhost:8080` to show the dashboard and seeded data.
4. Click **New assignment**, create a new entry, then show it in the table.
5. Edit its title, priority and status; demonstrate search/filter and toggle completion.
6. Open phpMyAdmin at `http://localhost:8081`, inspect the `studyflow.tasks` table and show the matching inserted/edited row.
7. Delete the entry in the app and refresh the phpMyAdmin table to confirm the deletion.
8. Refresh the app; demonstrate data is still loaded from MySQL. Optionally stop/restart containers and show persistence.
9. Upload the video to YouTube (Unlisted) or Google Drive (Anyone with the link — Viewer) and verify the instructor can access it.

## Key endpoints
- `GET /api/tasks` — list all tasks
- `POST /api/tasks` — create a task
- `GET /api/tasks/:id` — get task
- `PUT /api/tasks/:id` — replace editable fields
- `DELETE /api/tasks/:id` — delete a task

## Project structure
```
app/
  page.js                 Dashboard entry
  dashboard.js            Interactive task management UI
  globals.css             Styling
  api/tasks/route.js      List and create
  api/tasks/[id]/route.js Single task read/update/delete
lib/db.js                 MySQL connection pool
lib/tasks.js              Request validation
mysql/init/01-schema.sql  Table and starter data
Dockerfile                Next.js standalone multi-stage image
docker-compose.yml        web + MySQL + phpMyAdmin
.env.example              Environment variables template
```

## Troubleshooting
- If port 8080 or 8081 is already in use, change only the **host** part of the mapping in `docker-compose.yml` (e.g. `8090:3000`).
- Check status with `docker compose ps`, logs with `docker compose logs -f web mysql`.
- If MySQL fails health checks, inspect your `.env` and logs.
- To reset *all* database content deliberately: `docker compose down -v` then `docker compose up --build` (**deletes all saved tasks**).

## GitHub submission
Create a GitHub repo, push **all project files except `.env`**, and include both the GitHub URL and video URL in your submission. Avoid uploading passwords/credentials. The `.env.example` template is safe to commit.
