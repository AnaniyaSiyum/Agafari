# Agafari Engineering & Coding Standards

**Document Version**: 2.0  
**Target Architecture**: Next.js Monolith + Layered Object-Oriented Domain-Driven Design (DDD)

---

## 1. Architectural Integrity & Layer Rules

### Rule 1.1: Business Logic Scope
> **CRITICAL RULE**: Business logic belongs exclusively in `src/application/services/` or `src/domain/`, **NEVER** inside Next.js `route.ts` files or React page components.

- **Reference Examples**:
  - `src/application/services/CheckInService.ts`
  - `src/application/services/RsvpService.ts`
- **Route Handler Responsibility**: Route handlers in `src/app/api/` are thin HTTP controllers. Their sole duties are:
  1. Authenticate user role via `requireRole()` / `checkEventAccess()`.
  2. Parse HTTP request body / parameters.
  3. Invoke the application service.
  4. Catch domain errors and map them to HTTP status responses.

### Rule 1.2: Domain Layer Isolation Rule
- Files in `src/domain/` MUST NOT import from `src/app/`, `src/infrastructure/`, `mysql2`, `next/server`, or any HTTP/database library.
- Entities (`Event`, `Invitation`, `Ticket`, `Wish`, `MediaAsset`) and Value Objects (`LockWindow`, `Headcount`) must remain 100% pure TypeScript.

---

## 2. Error Handling & Domain Exceptions

All domain errors must inherit from `DomainError` in `src/domain/errors/DomainError.ts`. Controllers map them to standard HTTP status codes:

```typescript
// Standard Error Mapping Pattern in Route Handlers
try {
  const outcome = await checkInService.performCheckIn(input);
  return NextResponse.json(outcome);
} catch (error: any) {
  captureException(error, { route: '/api/qr/[code]' });
  if (error instanceof DomainError) {
    return NextResponse.json(
      { error: error.message },
      { status: error instanceof NotFoundError ? 404 : error instanceof RsvpLockedError ? 409 : 400 }
    );
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
```

---

## 3. Secret Management & Telemetry Rules

- **Zero Fallback Secrets in Production**: Hardcoded fallback strings (e.g. `process.env.JWT_SECRET || 'dev-secret'`) MUST throw an error in production mode (`process.env.NODE_ENV === 'production'`).
- **PII Redaction in Logging**: Guest phone numbers, HMAC signatures, JWT tokens, and passwords MUST be redacted or masked (`maskPhone()`) before writing to server logs or Sentry telemetry context.

---

## 4. Testing Standards

- **Unit Tests**: Every domain entity and value object must have pure in-memory unit tests in `tests/unit/domain.test.ts`.
- **Integration Tests**: Service classes must have integration test coverage in `tests/integration/services.test.ts` verifying use-case workflows.
