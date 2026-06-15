# Truxify Driver App

Flutter app for drivers to manage trips, view available loads, and handle deliveries.

## Features

- browse available loads
- view active trips and trip history
- handle delivery verification flows
- manage driver profile and documents

## Run Locally

```bash
flutter pub get
flutter run
```

If you are running against the local backend API, pass the API base URL:

```bash
flutter run --dart-define=TRUXIFY_API_BASE_URL=http://localhost:5000
```

## Useful Notes

- The app uses Supabase configuration passed through `--dart-define`.
- The login flow currently expects a backend OTP verification step.
- When testing locally against the backend API, use the local API base URL for your platform.
- See the root `README.md` and `docs/wiki/Getting-Started-&-Local-Setup.md` for the full setup flow.
