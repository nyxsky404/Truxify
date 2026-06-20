# Environment Setup & Compile-Time Injection

Truxify utilizes Flutter's internal dart-define parsing engine to handle compilation token management.

## Local Development Execution
Run command: flutter run --dart-define=TRUXIFY_API_BASE_URL=https://api-dev.truxify.com

## VS Code launch.json Integration
Add this tool argument array element to your configurations profile block:
"--dart-define", "TRUXIFY_API_BASE_URL=https://api-dev.truxify.com"

## Release Generation Build Targets
Android APK compile run:
flutter build apk --release --dart-define=TRUXIFY_API_BASE_URL=https://api.truxify.com

iOS Bundle compile run:
flutter build ios --release --dart-define=TRUXIFY_API_BASE_URL=https://api.truxify.com
