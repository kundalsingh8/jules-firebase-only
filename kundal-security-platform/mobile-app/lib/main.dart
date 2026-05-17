import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'providers/auth_provider.dart';
import 'providers/shift_provider.dart';
import 'services/sync_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/guard/guard_dashboard.dart';
import 'screens/officer/officer_dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();

  // Note: Firebase initialization needs actual google-services.json/GoogleService-Info.plist config
  // await Firebase.initializeApp();

  final syncService = SyncService();
  await syncService.init();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ShiftProvider(syncService)),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kundal Security',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A8A), // brand.navy
          primary: const Color(0xFF1E3A8A),
          secondary: const Color(0xFF10B981), // brand.emerald
        ),
        useMaterial3: true,
      ),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (auth.isLoading) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        if (auth.currentUser == null) {
          return const LoginScreen();
        }

        // Return screen based on role
        if (auth.userModel?.role == 'area_officer' || auth.userModel?.role == 'guard_supervisor') {
          return const OfficerDashboard();
        }

        return const GuardDashboard();
      },
    );
  }
}
