# Comment App

**A backend-focused full-stack comment application with nested comments, soft-delete, edit windows, and Docker-based deployment.**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Comment Endpoints](#comment-endpoints)
  - [Example cURL Commands](#example-curl-commands)
- [Scheduled Purge](#scheduled-purge)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🔒 **JWT-based Authentication**: Secure register and login flows with bcrypt password hashing.
- 💬 **Nested Comments**: Unlimited reply levels with TypeORM's closure tables.
- ✏️ **15-minute Edit Window**: Edit comments within 15 minutes after posting.
- 🗑️ **Soft Delete and Restore**: Temporarily delete comments, restore within a 15-minute window.
- ⏱️ **Automatic Purge**: Soft-deleted comments automatically purged after expiration using a cron job.
- 🐳 **Dockerized Setup**: Easy development and deployment using Docker Compose.

---

## Tech Stack

- **Language:** TypeScript ([Website](https://www.typescriptlang.org))
- **Backend Framework:** NestJS ([Website](https://nestjs.com))
- **ORM:** TypeORM ([Website](https://typeorm.io))
- **Database:** PostgreSQL ([Website](https://www.postgresql.org))
- **Authentication:** Passport.js ([Website](https://www.passportjs.org)) with JWT
- **Scheduling:** NestJS Schedule ([Docs](https://docs.nestjs.com/techniques/task-scheduling))
- **Containerization:** Docker and Docker Compose ([Website](https://www.docker.com))

---

## Architecture
```plaintext
Client <--> NestJS API <--> PostgreSQL
Client ↔ Controller ↔ Service ↔ Repository ↔ Database
```

- **Modules:** Auth, Users, Comments, Notifications, Scheduling
- **Controllers:** Handle incoming HTTP requests
- **Services:** Contain business logic and data handling
- **Repositories:** Manage interactions with the PostgreSQL database using TypeORM

### Application Flows

- **Authentication:**
```plaintext
Client --> AuthController --> AuthService --> UserRepository --> PostgreSQL
```

- **Creating Comments:**
```plaintext
Client --> CommentsController --> CommentsService --> CommentRepository --> PostgreSQL
```

- **Retrieving Nested Comments:**
```plaintext
Client --> CommentsController --> CommentsService --> CommentRepository (Tree Query) --> PostgreSQL
```

---

## Getting Started

### Prerequisites

- Node.js (v16+): [Download](https://nodejs.org)
- pnpm (recommended): [Installation](https://pnpm.io/installation) or npm/yarn
- Docker Desktop: [Download](https://www.docker.com/products/docker-desktop)

### Installation

Clone and install dependencies:
```bash
git clone https://github.com/yourusername/comment-app.git
cd comment-app/backend
pnpm install
```


### Environment Variables

Create `.env` file in `backend/` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=secret
DB_NAME=comment_app
JWT_SECRET=your_jwt_secret
PORT=3001
```

## Running with Docker

```bash
cd comment-app
docker-compose up -d

cd backend
pnpm run start:dev
```

## Running Locally

```bash
psql -U postgres -c "CREATE DATABASE comment_app;"
pnpm run start:dev
```

## Usage

### Authentication

- Register – `POST /auth/register`
- Login – `POST /auth/login`

### Comment Endpoints

Include header `Authorization: Bearer <access_token>`

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/comments`                | Fetch full nested comment tree     |
| POST   | `/comments`                | Create a new comment               |
| PUT    | `/comments/:id`            | Edit a comment (within 15 mins)    |
| DELETE | `/comments/:id`            | Soft-delete a comment              |
| PATCH  | `/comments/:id/restore`    | Restore a soft-deleted comment     |

### Example cURL Commands

```bash
# Login & extract token
token=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"secret"}' \
  | sed -r 's/.*"accessToken":"([^"]+)".*/\1/')

echo "$token"

# Create a root comment
curl -X POST http://localhost:3001/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{"content":"Hello World!"}'

# Fetch nested comments
curl http://localhost:3001/comments \
  -H "Authorization: Bearer $token"

# Reply to a comment
curl -X POST http://localhost:3001/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{"content":"Reply text","parentId":"<COMMENT_ID>"}'

# Edit a comment
curl -X PUT http://localhost:3001/comments/<ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{"content":"Updated text"}'

# Soft-delete a comment
curl -X DELETE http://localhost:3001/comments/<ID> \
  -H "Authorization: Bearer $token"

# Restore a soft-deleted comment
curl -X PATCH http://localhost:3001/comments/<ID>/restore \
  -H "Authorization: Bearer $token"
```

## Scheduled Purge

Automatic removal of expired soft-deleted comments every 10 minutes:

```typescript
@Cron(CronExpression.EVERY_10_MINUTES)
async purgeExpired() {
  const expired = await this.repo.find({
    where: { deletedUntil: LessThan(new Date()) },
  });
  await this.repo.remove(expired);
}
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/NewFeature`
3. Commit your changes: `git commit -m 'Add NewFeature'`
4. Push your branch: `git push origin feature/NewFeature`
5. Create a Pull Request

## License

This project is licensed under the MIT License. See `LICENSE` for details.
