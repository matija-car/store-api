# Production Deployment Checklist

Set these variables in Railway before deploying. Never commit real credentials or
secrets to the repository.

| Variable | Safe production value |
|---|---|
| `JWT_SECRET` | A randomly generated secret of at least 32 bytes; do not use the local fallback or a placeholder. |
| `JWT_EXPIRATION` | Access-token lifetime in milliseconds, kept short enough for your risk tolerance (for example `900000` for 15 minutes). |
| `JWT_REFRESH_EXPIRATION` | Refresh-token lifetime in milliseconds, rotated and limited to the business lifetime you want (for example `604800000` for 7 days). |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL beginning with `jdbc:postgresql://`, using the private database connection. |
| `SPRING_DATASOURCE_USERNAME` | A dedicated least-privilege application database user. |
| `SPRING_DATASOURCE_PASSWORD` | A strong Railway-managed database password. |
| `SPRING_DATASOURCE_DRIVER` | `org.postgresql.Driver` (the application property name). |
| `SPRING_DATASOURCE_DRIVER_CLASS_NAME` | `org.postgresql.Driver` if your deployment platform exposes Spring's conventional alias. |
| `SPRING_PROFILES_ACTIVE` | `prod`; Swagger remains protected outside `dev`, and this documents the intended deployment profile. |
| `APP_CORS_ALLOWED_ORIGINS` | Real frontend origin(s), comma-separated, with no trailing slash; do not include localhost. |
| `APP_FRONTEND_URL` | The real frontend base URL, including `https://` and no reset-password path suffix. |
| `MAIL_HOST` | SMTP provider hostname. |
| `MAIL_PORT` | SMTP provider port, normally `587` for STARTTLS or `465` for implicit TLS. |
| `MAIL_USERNAME` | SMTP account or provider username. |
| `MAIL_PASSWORD` | SMTP password, app password, or provider credential stored as a Railway secret. |

Configure Railway's health check URL as `/api/actuator/health` because the
application uses the `/api` servlet context path.

Generate a strong base64 JWT secret (32 random bytes):

```bash
openssl rand -base64 32
```
