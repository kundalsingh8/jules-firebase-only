import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize Firebase (Requires config generation via flutterfire configure)
  // await Firebase.initializeApp();
  
  // Enable offline persistence
  // FirebaseFirestore.instance.settings = const Settings(
  //   persistenceEnabled: true,
  //   cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
  // );
  
  runApp(const MyApp());
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
      home: const Scaffold(
        body: Center(
          child: Text('Kundal Security App (Flutter)'),
        ),
      ),
    );
  }
}
