import 'package:flutter/foundation.dart';

class EnvConfig {
  static const String apiBaseUrl = String.fromEnvironment(
    'TRUXIFY_API_BASE_URL',
    defaultValue: 'https://api-dev.truxify.com',
  );

  static bool get isProduction => !kDebugMode && !apiBaseUrl.contains('dev');
  
  static void logConfiguration() {
    if (kDebugMode) {
      print('=============================================');
      print('🚀 TRUXIFY ACTIVE API ENVIRONMENT CONFIG');
      print('🔗 BASE URL: $apiBaseUrl');
      print('=============================================');
    }
  }
}
