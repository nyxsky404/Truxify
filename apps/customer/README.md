# Truxify Customer App

Flutter app for customers to create bookings, track orders, and manage profile details.

## Features

- create freight bookings
- browse trucks and order details
- track active shipments
- manage saved addresses, payments, and profile data

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
- If you are testing against a local backend, pass the API base URL for your environment.
- See the root `README.md` and `docs/wiki/Getting-Started-&-Local-Setup.md` for the full setup flow.
