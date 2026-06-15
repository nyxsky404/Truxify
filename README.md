# Truxify

Broker-free, ML-powered, blockchain-secured freight platform.

Truxify connects manufacturers and truck drivers directly so freight bookings can be handled with less brokerage overhead, better transparency, and more control for both sides.

## Overview

Truxify is a monorepo with two Flutter apps and a multi-service backend stack:

- `apps/customer` - Customer-facing Flutter app for booking and tracking freight
- `apps/driver` - Driver-facing Flutter app for trips, loads, and delivery flow
- `backend/api` - Node.js + Express API gateway and orchestration layer
- `backend/ml` - FastAPI service for ML predictions and matching helpers
- `blockchain` - Solidity contracts for escrow and trust-related flows
- `packages/truxify_shared` - Shared Dart models, repositories, and UI pieces
- `docs` - Architecture, schema, and setup documentation

## What Truxify Includes

- freight booking and order tracking
- driver and customer mobile experiences
- delivery verification and live trip flows
- backend orchestration for auth, orders, and tracking
- ML-assisted routing and matching
- blockchain components for trust and escrow

## Getting Started

For a full setup walkthrough, see `docs/wiki/Getting-Started-&-Local-Setup.md`.

### Backend API

```bash
cd backend/api
cp .env.example .env
npm install
npm run dev
```

### Driver App

```bash
cd apps/driver
flutter pub get
flutter run
```

### Customer App

```bash
cd apps/customer
flutter pub get
flutter run
```

## Development Notes

- The project uses Supabase, Firebase, Redis, MongoDB, and optional blockchain services.
- The backend is split into route handlers, middleware, services, and tests under `backend/api`.
- The Flutter apps use `--dart-define` for configuration where needed.
- Keep environment-specific values out of source control.

## Useful References

- `docs/wiki/Getting-Started-&-Local-Setup.md`
- `docs/wiki/Architecture-&-Tech-Stack.md`
- `backend/api/README.md`
- `apps/driver/README.md`
- `apps/customer/README.md`
