import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/sync_service.dart';
import '../services/location_service.dart';

class ShiftProvider extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final SyncService _syncService;

  bool _isOnShift = false;
  bool _isLoading = false;
  String? _currentShiftId;

  bool get isOnShift => _isOnShift;
  bool get isLoading => _isLoading;

  ShiftProvider(this._syncService);

  Future<void> checkCurrentShift(String guardId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final query = await _firestore
          .collection('attendance')
          .where('guardId', isEqualTo: guardId)
          .where('status', isEqualTo: 'active')
          .limit(1)
          .get();

      if (query.docs.isNotEmpty) {
        _isOnShift = true;
        _currentShiftId = query.docs.first.id;
      } else {
        _isOnShift = false;
        _currentShiftId = null;
      }
    } catch (e) {
      print("Error checking shift: \$e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> clockIn(String guardId, String societyId, String? photoUrl) async {
    _isLoading = true;
    notifyListeners();

    try {
      final location = await LocationService.getCurrentLocation();

      final data = {
        'guardId': guardId,
        'societyId': societyId,
        'clockInTime': FieldValue.serverTimestamp(),
        'clockInLocation': location != null ? GeoPoint(location.latitude, location.longitude) : null,
        'photoUrl': photoUrl,
        'status': 'active',
      };

      // Add offline support
      await _syncService.enqueueOperation('attendance', 'add', data);

      _isOnShift = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print("Clock in error: \$e");
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> clockOut() async {
    if (_currentShiftId == null) return false;

    _isLoading = true;
    notifyListeners();

    try {
      final location = await LocationService.getCurrentLocation();

      final data = {
        'clockOutTime': FieldValue.serverTimestamp(),
        'clockOutLocation': location != null ? GeoPoint(location.latitude, location.longitude) : null,
        'status': 'completed',
      };

      await _syncService.enqueueOperation('attendance', 'update', data, docId: _currentShiftId);

      _isOnShift = false;
      _currentShiftId = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print("Clock out error: \$e");
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
