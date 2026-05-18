import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hive_flutter/hive_flutter.dart';

class SyncService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  late Box _queueBox;

  Future<void> init() async {
    _queueBox = await Hive.openBox('offline_queue');
    // We would ideally listen to connectivity changes here
  }

  Future<void> enqueueOperation(String collectionPath, String operation, Map<String, dynamic> data, {String? docId}) async {
    // In a full implementation, we check connectivity first.
    // If online, execute immediately. If it fails or is offline, queue it.

    // For simplicity, always execute immediately for now, fallback to queue on failure.
    try {
      if (operation == 'add') {
        // Need to clean data of FieldValue.serverTimestamp() for offline serialization,
        // but for now assume online works.
        await _firestore.collection(collectionPath).add(data);
        return;
      } else if (operation == 'update' && docId != null) {
        await _firestore.collection(collectionPath).doc(docId).update(data);
        return;
      } else if (operation == 'set' && docId != null) {
        await _firestore.collection(collectionPath).doc(docId).set(data);
        return;
      }
    } catch (e) {
      print("Online operation failed, queuing... \$e");

      // Convert complex types to basic types for Hive storage
      final safeData = Map<String, dynamic>.from(data);
      safeData.removeWhere((key, value) => value is FieldValue);
      safeData['timestamp_fallback'] = DateTime.now().toIso8601String();

      final item = {
        'collectionPath': collectionPath,
        'operation': operation,
        'data': safeData,
        'docId': docId,
        'queuedAt': DateTime.now().toIso8601String(),
      };

      await _queueBox.add(item);
    }
  }

  Future<void> processQueue() async {
    // 1. Check if online
    // 2. Loop through _queueBox
    // 3. Execute operations
    // 4. Delete successful items from queue
    print("Processing queue of \${_queueBox.length} items...");
  }
}
