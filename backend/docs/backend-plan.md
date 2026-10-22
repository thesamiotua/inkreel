# Inkreel backend plan

Stack: FastAPI, PostgreSQL, SQLAlchemy 2.0 (or SQLModel), Alembic, Pydantic, JWT auth. Frontend (React + Vite) already exists in `frontend/`.
Ports: frontend 8443 (as set by Figma Make), backend 8000, Postgres 5432.

## Folder layout (backend/)

```
backend/
  app/
    main.py            # creates the FastAPI app, includes routers, CORS
    config.py          # settings from .env (database URL, secret key)
    database.py        # engine, session, get_db dependency
    models/            # SQLAlchemy tables (one file per area)
    schemas/           # Pydantic request/response models
    routers/           # endpoints (thin: validate, call service, return)
    services/          # business logic (hash password, create post, etc.)
    auth.py            # password hashing, JWT create/verify, get_current_user
  alembic/             # migrations
  uploads/             # local dev file storage (git-ignored)
  tests/
  docker-compose.yml   # Postgres for local dev
  .env.example         # variable names only, no real values
  requirements.txt
```

## Tables

All tables get `id` (integer or UUID primary key) and `created_at`. "FK" = foreign key.

**users**: email (unique), username (unique), display_name, password_hash, bio (max 160), avatar_url, banner_url, is_active.

**categories**: name (unique), slug (unique). Seed: Travel, Food, Tech, Lifestyle, Study.

**posts**: author_id (FK users), type (`video` | `article`), title, body (article text, or the caption for a video), cover_image_url, video_url, thumbnail_url, duration_seconds (video only), reading_minutes (article only), category_id (FK), status (`draft` | `published`), published_at.
- Index on (status, published_at) for the feed, and on author_id for profiles and the dashboard.

**tags**: name (unique). **post_tags**: post_id, tag_id (composite primary key).

**comments**: post_id (FK), author_id (FK), body, parent_comment_id (nullable, for replies later).

**likes**: user_id, post_id, composite primary key (a user can like a post once).

**saves**: user_id, post_id, composite primary key (the "Saved" tab).

**follows**: follower_id, followee_id, composite primary key, with a check that the two are different.

**friendships**: requester_id, addressee_id, status (`pending` | `accepted`), unique pair. "Friends" = accepted rows in either direction.

**post_views**: post_id, viewer_id (nullable), viewed_at. The dashboard chart groups these by day.

**conversations**: user_a_id, user_b_id (store the smaller id in user_a to keep the pair unique). **messages**: conversation_id, sender_id, body, image_url (nullable), read_at (nullable).

**notifications**: user_id (who receives it), actor_id (who did it), type (`follow` | `comment` | `like` | `friend_request`), post_id (nullable), read_at (nullable).

Counts (likes, comments, followers, views) are not stored on posts or users. Count them with queries, and add caching later only if it's slow.

## Endpoints (all under /api, JSON; * = needs login)

**Auth**
- POST /auth/signup: email, username, password; returns user
- POST /auth/login: returns access token
- GET /auth/me*
- POST /auth/change-password*

**Users and profiles**
- GET /users/{username}: profile and counts
- PATCH /users/me*: display name, username, bio
- POST /users/me/avatar* and /users/me/banner*
- POST /users/{username}/follow* and DELETE (unfollow)
- GET /users/{username}/posts?type=video|article: profile tabs
- GET /users/me/saved*

**Feed and posts**
- GET /posts?type=&category=&q=&page=: home feed, search, filter (published only)
- GET /posts/{id}: article or video page, records a view
- GET /posts/{id}/related: "More from Inkreel" sidebar
- POST /posts*: create article, or video metadata
- PATCH /posts/{id}* and DELETE /posts/{id}* (author only)
- POST /posts/{id}/publish*
- POST /uploads/video*, /uploads/image*: file upload (see limits below)
- GET /categories

**Reactions**
- POST /posts/{id}/like* and DELETE
- POST /posts/{id}/save* and DELETE
- GET /posts/{id}/comments, POST /posts/{id}/comments*, DELETE /comments/{id}*

**Creator dashboard**
- GET /me/dashboard/summary*: total views, likes, comments, followers
- GET /me/dashboard/views?days=30*: views per day for the chart
- GET /me/posts?status=*: the "Your posts" table

**Friends**
- GET /friends*, GET /friends/requests*
- POST /friends/requests*: send (by user id)
- POST /friends/requests/{id}/accept* and /decline*
- DELETE /friends/{user_id}*
- GET /users/search?q=*: "Find people"

**Messages**
- GET /conversations*: list with last message and unread count
- GET /conversations/{id}/messages*
- POST /conversations/{id}/messages*
- WebSocket /ws/messages: live delivery (added last)

**Notifications**
- GET /notifications*, POST /notifications/read-all*

## v1 limits (keep it small)

- Video upload max 200 MB, MP4 only. Thumbnails: the creator uploads an image (no frame picker).
- Local disk storage in development; move to S3-compatible storage (Cloudflare R2 or Backblaze B2) when deploying.
- Videos play with the browser's `<video>` tag. Make sure your server supports HTTP range requests, or seeking won't work.
- No video transcoding, live streaming or email verification in v1.
- Search is a simple `ILIKE` on title, then Postgres full-text search later.

## Build order (small slices, one per day or two)

Rule for every slice: you write the first draft from comments, you test it, then Claude reviews it.

**Phase 0: Setup**
1. Create `backend/`, a virtual environment, install FastAPI, uvicorn, SQLAlchemy, psycopg, Alembic, pydantic-settings. *Done when* `GET /health` returns `{"status":"ok"}`.
2. `docker-compose.yml` with Postgres, `.env` and `config.py`, connect from `database.py`. *Done when* a test query runs.
3. Set up Alembic. *Done when* an empty migration applies.

**Phase 1: Accounts**
4. `users` table and migration.
5. Sign up (hash the password, reject duplicates). *Done when* a duplicate email returns 409.
6. Log in and JWT, then `get_current_user` and `GET /auth/me`.
7. Profile endpoints (`GET /users/{username}`, `PATCH /users/me`).
8. Frontend: replace the fake login with real calls (store the token, send it on requests).

**Phase 2: Posts**
9. `categories`, `posts` tables, seed categories.
10. Create/edit/delete/publish an article. Only the author can change it.
11. `GET /posts` with pagination, type and category filters.
12. `GET /posts/{id}` and records a view.
13. Image upload (cover, avatar, thumbnail) with size and type checks.
14. Video upload (200 MB cap), serving with range requests.
15. Frontend: the feed, article page and video page read real data.

**Phase 3: Interaction**
16. Likes and saves. 17. Comments. 18. Search. 19. Related posts.

**Phase 4: Creator dashboard**
20. Summary numbers. 21. Views per day. 22. "Your posts" table with edit and delete.

**Phase 5: Social**
23. Follows. 24. Friend requests. 25. Notifications (created when someone likes, comments or follows).

**Phase 6: Messaging**
26. Conversations and messages over normal endpoints. 27. WebSocket for live delivery. 28. Unread counts and read receipts.

**Phase 7: Quality and shipping**
29. Tests for auth and posts (pytest). 30. Rate-limit login. 31. README with screenshots and a diagram. 32. Deploy (backend, Postgres, object storage).

## Security checklist (check before each commit)

- Passwords are hashed (bcrypt or argon2), never logged or returned.
- `.env` is ignored; `.env.example` has names only.
- Every "mine" endpoint checks the logged-in user owns the row.
- Uploads: check size, check file type, rename files, never trust the original filename.
- CORS allows only the frontend's address.
