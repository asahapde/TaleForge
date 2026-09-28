# TaleForge

A library of branching fiction. Read a chapter, then choose which way the story goes. If none of the paths is the one you'd take, write your own chapter and it becomes a new choice for every reader after you.

Live: [tale-forge.vercel.app](https://tale-forge.vercel.app/)

![Home](Screenshots/home.png)

## How branching works

Every story is a tree of chapters. The author writes the first chapter (and usually a main path); any signed-in writer can add an alternative next chapter after any published chapter, as long as the author left the story open to branches.

- Each branch has a **choice line** ("Follow the sound down the stairs") that readers see at the end of the parent chapter.
- The author's own chapters are marked as **the author's path**; everyone else's are marked **a branch by …**.
- A chapter can have at most 8 branches.
- The author can remove any chapter (and everything after it). A contributor can remove their own chapter only while nobody has written past it.

![Story map](Screenshots/story.png)

![Reader](Screenshots/reader.png)

## Stack

| Part | Tech | Hosted on |
| --- | --- | --- |
| API | Java 21, Spring Boot 3.5, Spring Security (JWT), Spring Data JPA, Flyway | Render (Docker, free tier) |
| Database | PostgreSQL | Neon (free tier) |
| Web | Next.js 15 (App Router), React 19, Tailwind CSS 4 | Vercel |

The browser only talks to the Next.js app. Requests to `/api/*` are rewritten to the Spring Boot API, so there is no CORS setup in the browser path and the API URL never ships to the client. Public pages (home, library, stories, chapters, writer profiles) are rendered on the server and cached with incremental static regeneration, so readers rarely wait on the API even when it is cold.

## Run it locally

You need Java 21, Maven, and Node 20+.

**API** (uses an in-memory H2 database seeded with demo stories; no setup needed):

```bash
cd backend
mvn spring-boot:run
```

It serves `http://localhost:8080/api`. Check it with `curl http://localhost:8080/api/health`.

**Web**:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The demo accounts `johndoe`, `janedoe`, `alexsmith`, `sarahjones` and `mikebrown` all use the password `password123`.

To point the local API at a real Postgres database instead of H2, copy `backend/.env.example`, fill it in, export the variables, and run with `SPRING_PROFILES_ACTIVE=prod`.

## Deploy

### 1. Database: Neon

1. Create a project at [neon.tech](https://neon.tech).
2. On the dashboard, open **Connect**, turn **Connection pooling off**, and copy the connection string. It looks like `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`.

The API accepts this string as-is through `DATABASE_URL`; it is converted to JDBC settings on startup. Flyway creates the tables and seed data on first boot. Use the direct (non-pooler) string, because Flyway migrations don't work well through PgBouncer.

Neon suspends an idle database after a few minutes and wakes it automatically on the next query, usually in under a second, so there's no manual "restore project" step like on Supabase.

### 2. API: Render

1. At [render.com](https://render.com), choose **New > Blueprint** and select this repository. Render reads `render.yaml` and creates the `taleforge-api` web service from `backend/Dockerfile`.
2. When prompted, paste the Neon connection string as `DATABASE_URL`. `JWT_SECRET` is generated for you.
3. If the frontend lives somewhere other than `tale-forge.vercel.app`, update `CORS_ALLOWED_ORIGINS`.

Once deployed, `https://<your-service>.onrender.com/api/health` should return `{"status":"ok"}`.

Free Render services sleep after 15 minutes without traffic. `.github/workflows/keep-warm.yml` pings the health endpoint every 10 minutes to prevent that. To turn it on, add a repository variable (**Settings > Secrets and variables > Actions > Variables**) named `API_HEALTH_URL` with the health URL above. The health check doesn't touch the database, so Neon can still sleep. The free plan's 750 instance hours a month cover one service running all month.

### 3. Web: Vercel

1. Import the repository at [vercel.com](https://vercel.com/new) and set the **Root Directory** to `frontend`.
2. Add the environment variable `API_URL=https://<your-service>.onrender.com/api`.
3. Deploy.

## Configuration

**API** (`backend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres URL in `postgresql://user:pass@host/db` form (Neon, Render, Heroku style). Alternatively set `DB_URL`, `DB_USERNAME` and `DB_PASSWORD` directly. |
| `JWT_SECRET` | At least 32 characters. Required in production. |
| `JWT_EXPIRATION_HOURS` | Session length, default 168 (7 days). |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins; wildcards like `https://*.vercel.app` are allowed. |
| `PORT` | Set by the host; default 8080. |

**Web** (`frontend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `API_URL` | Base URL of the API including `/api`. Default `http://localhost:8080/api`. |

## Project layout

```
backend/
  src/main/java/com/taleforge/
    config/       app properties, security, DATABASE_URL parsing
    domain/       JPA entities (User, Story, Chapter, Comment, StoryLike)
    exception/    API errors and the JSON error handler
    repository/   Spring Data repositories and query projections
    security/     JWT issue/parse and request filter
    service/      business rules (visibility, branching permissions, counts)
    web/          REST controllers; web/dto holds request/response records
  src/main/resources/db/migration/   Flyway schema and seed data
  Dockerfile
frontend/
  src/app/        routes (library, story, chapter reader, branch editor, desk, writers, auth)
  src/components/ UI (branch map, reader, covers, comments, forms)
  src/lib/        API client, server fetch helper, formatting
render.yaml       Render blueprint for the API
```

## API overview

All paths are under `/api`. Reads are public; everything else needs `Authorization: Bearer <token>` from login or register.

| Method and path | What it does |
| --- | --- |
| `POST /auth/register`, `POST /auth/login` | Get a token |
| `GET /me`, `PUT /me`, `GET /me/stories`, `GET /me/branches` | Your account, including drafts |
| `GET /stories?q=&tag=&sort=new\|popular\|liked\|branching\|updated&page=` | Search the library |
| `POST /stories`, `GET/PUT/DELETE /stories/{id}` | Stories (creating one also creates its first chapter) |
| `GET /stories/{id}/tree` | Every chapter in the story as a flat tree |
| `GET/PUT/DELETE /chapters/{id}` | A chapter with the path to it and its next choices |
| `POST /chapters/{id}/branches` | Write a new next chapter |
| `GET /chapters/recent` | Latest branches across the site |
| `GET/POST/DELETE /stories/{id}/like` | Likes |
| `GET/POST /stories/{id}/comments`, `PUT/DELETE /comments/{id}` | Comments |
| `GET /users/{username}`, `/users/{username}/stories`, `/users/{username}/branches` | Public profiles |
| `GET /tags`, `GET /health` | Subjects with counts, health check |

## Author

Abdullah Sahapdeen ([asahapde](https://github.com/asahapde))
