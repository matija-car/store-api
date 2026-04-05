# ShoppingStore API

A REST API for managing an online store — users, products, categories, and authentication. Built with Spring Boot and secured with JWT.

## Stack

- Java 17 + Spring Boot 3.2
- Spring Security + JWT
- MySQL (Docker / Railway) / H2 (local dev)
- Flyway for migrations
- Swagger UI for API docs

## Live demo

API is deployed on Railway and available at:

```
https://store-api-production-78a6.up.railway.app/api/swagger-ui/index.html
```

## CI/CD

Every push to `main` triggers a GitHub Actions pipeline that:

1. Runs all 45 tests (MockMvc + Spring integration tests)
2. Builds a Docker image and pushes it to GitHub Container Registry
3. Deploys to Railway automatically — only if all tests pass

## Getting started

### Run locally (H2 in-memory database)

Just run the app from IntelliJ or:

```bash
./mvnw spring-boot:run
```

### Run with Docker (MySQL)

```bash
docker-compose up --build
```

That's it. Docker pulls MySQL automatically, runs migrations, and starts the app.

To stop:
```bash
docker-compose down
```

To stop and wipe the database:
```bash
docker-compose down -v
```

## API docs

Once the app is running, Swagger UI is at:

```
http://localhost:8080/api/swagger-ui.html
```

## Auth

Most endpoints require a JWT token. To get one:

1. Register at `POST /auth/register`
2. Login at `POST /auth/login` — returns a token
3. Pass the token as `Bearer <token>` in the `Authorization` header

## Project structure

```
src/
├── controller/    # REST endpoints
├── service/       # Business logic
├── repository/    # Database access
├── entity/        # JPA entities
├── dto/           # Request/response objects
├── security/      # JWT filter, token provider
├── mapper/        # MapStruct mappers
└── exception/     # Global error handling
```

## Tests

```bash
./mvnw test
```

Includes integration tests for services and controller tests with MockMvc.


> ### Planned features
> User addresses
>
> User profiles
>
> Product wishlist