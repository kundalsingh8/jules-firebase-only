import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  UserModel? _userModel;
  User? get currentUser => _auth.currentUser;
  UserModel? get userModel => _userModel;
  bool _isLoading = true;

  bool get isLoading => _isLoading;

  AuthProvider() {
    _init();
  }

  Future<void> _init() async {
    _auth.authStateChanges().listen((User? user) async {
      _isLoading = true;
      notifyListeners();

      if (user != null) {
        await _fetchUserData(user.uid);
      } else {
        _userModel = null;
      }

      _isLoading = false;
      notifyListeners();
    });
  }

  Future<void> _fetchUserData(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        _userModel = UserModel.fromMap(doc.data()!, doc.id);
      }
    } catch (e) {
      print("Error fetching user data: \$e");
    }
  }

  Future<bool> signIn(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();
      await _auth.signInWithEmailAndPassword(email: email, password: password);
      return true;
    } catch (e) {
      print("Sign in error: \$e");
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
