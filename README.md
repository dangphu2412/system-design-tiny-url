# Post Service with Redis Caching & PostgreSQL CDC

This repository contains a robust, modular architecture that separates application logic from change data capture (CDC) logic. It demonstrates how to build a performant API that supports real-time cache synchronization using PostgreSQL logical replication and Redis.

## 📚 Overview

The repository consists of **two main components**:

1. **App Service** (`/app`)
    - RESTful HTTP API (GET, POST, PUT, DELETE)
    - Handles database reads/writes
    - Implements Redis caching layer for fast access

2. **CDC Service** (`/cdc`)
    - Listens to PostgreSQL changes using logical replication (`pg-logical-replication`)
    - Updates Redis cache based on database changes in real time

---

## 🧱 Architecture

```
              ┌──────────────┐
              │  Client    │
              └────┤─────┘
                   │
                   ▼
           ┌─────────────────┐       PostgreSQL (logical replication slot)
           │   App Server  │◄─────────────────────────────────────────────┐
           │ (HTTP API)    │                                     │
           └────┬────┘                                     │
                │      │                                         │
                ▼      ▼                                         │
         Redis Cache   PostgreSQL (main DB)                      │
                ▲                                                │
                │                                                │
           ┌────┤─────────────────────────────────┐
           │   CDC App   │      pg-logical-replication           │
           │  Listener   │◄─────────────────────────────────────┘
           └──────────────────────────────────────┘
```

---

## 🚀 Features

### App Service

- REST API with the following endpoints:
    - `GET /posts`: Supports pagination (`page`, `size`) with Redis-first strategy
    - `GET /posts/:id`
    - `POST /posts`
    - `PUT /posts/:id`
    - `DELETE /posts/:id`
- Uses Redis to store:
    - **Paginated result sets** as arrays: key format `post:page:<page>:size:<size>`
    - **Individual posts**: key format `post:<postId>`
- On cache miss, reads from DB, populates cache.

### CDC Service

- Connects to PostgreSQL using a logical replication slot
- Uses `pgoutput` plugin (or similar) for decoding (can apply wal2json)
- Detects insert/update/delete on `posts` table
- Directly updates individual `post:<postId>` in Redis
- Optionally invalidates affected pagination cache keys (if configured)

---

## 💾 Redis Caching Strategy

- **Pagination results** are cached using compound keys:
  ```
  Key: post:<page>:<size>
  Value: [postId1, postId2, ...]
  ```

- **Individual posts** are stored as:
  ```
  Key: post:<postId>
  Value: JSON.stringify(post)
  ```

- On cache hit:
    - Lookup post list by pagination key
    - Lookup each post by `post:<postId>` to return full objects

- On cache miss:
    - Query DB
    - Populate both post list and individual post cache entries

---

## 🔄 Change Data Capture (CDC)

- The CDC app connects to PostgreSQL using `pg-logical-replication`
- A logical replication slot is created (if not already)
- Only the `posts` table is subscribed
- On receiving a change:
    - **Insert/Update**: Updates `post:<postId>` in Redis
    - **Delete**: Deletes `post:<postId>` from Redis
    - **Optional**: Invalidate pagination keys (to ensure consistent page results)

---

## 🥮 Development Setup

1. Clone repository
   🚀 Run with Docker Compose (Recommended)
2. 
3. To simplify setup, you can use the preconfigured docker-compose.yml:

```bash
docker-compose up --build
```

This will spin up:
- PostgreSQL (with logical replication)
- Redis
- Kafka in Kraft mode

📦 Make sure .env or environment variables are set correctly in the compose file.
1. Run App Server:
   ```bash
   cd app
   npm install
   npm run start:dev
   ```

2. Run CDC Service:
   ```bash
   cd cdc
   npm install
   npm run start
   ```

---

## 📍 Future Enhancements

- Invalidate specific pagination keys based on post updates
- TTL-based caching
- Hook up search service (e.g., Elasticsearch) for fuzzy/full-text queries
- Add metrics/logging middleware
- Dockerize both services

---

## 🛠 Tech Stack

- **Node.js / TypeScript**
- **NestJS**
- **Redis** (via `cache-manager`)
- **PostgreSQL** (Logical Replication)
- **pg-logical-replication** (CDC listener)

