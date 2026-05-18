import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:provider/provider.dart';
import 'dart:io';
import '../../providers/auth_provider.dart';
import '../../services/location_service.dart';
import '../../services/sync_service.dart';

class PatrolView extends StatefulWidget {
  const PatrolView({super.key});

  @override
  State<PatrolView> createState() => _PatrolViewState();
}

class _PatrolViewState extends State<PatrolView> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  bool isScanning = false;
  String scanResult = '';

  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller!.pauseCamera();
    } else if (Platform.isIOS) {
      controller!.resumeCamera();
    }
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      if (!isScanning && scanData.code != null) {
        setState(() {
          isScanning = true;
          scanResult = scanData.code!;
        });
        controller.pauseCamera();
        _processScan(scanResult);
      }
    });
  }

  Future<void> _processScan(String checkpointId) async {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final location = await LocationService.getCurrentLocation();
      final auth = context.read<AuthProvider>();

      final logData = {
        'checkpointId': checkpointId,
        'guardId': auth.currentUser?.uid,
        'societyId': auth.userModel?.societyId,
        'timestamp': DateTime.now().toIso8601String(), // Use ISO string for offline compat, or FieldValue if only online
        'location': location != null ? {'lat': location.latitude, 'lng': location.longitude} : null,
      };

      // We are retrieving the sync service implicitly via Provider or we can just instantiate a new one.
      // For proper DI we'd get it from a locator or provider. Here we just instantiate.
      final syncService = SyncService();
      await syncService.init();
      await syncService.enqueueOperation('patrol_logs', 'add', logData);

      if (mounted) {
        Navigator.pop(context); // Dismiss loading
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Checkpoint logged successfully!'), backgroundColor: Colors.green),
        );
        setState(() {
          isScanning = false;
          scanResult = '';
        });
        controller?.resumeCamera();
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // Dismiss loading
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error logging checkpoint: \$e'), backgroundColor: Colors.red),
        );
        setState(() {
          isScanning = false;
        });
        controller?.resumeCamera();
      }
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patrol Checkpoint'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 5,
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
              overlay: QrScannerOverlayShape(
                borderColor: Theme.of(context).colorScheme.secondary,
                borderRadius: 10,
                borderLength: 30,
                borderWidth: 10,
                cutOutSize: 300,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: isScanning
                  ? const Text('Processing...', style: TextStyle(fontSize: 18))
                  : const Text('Scan a checkpoint QR code', style: TextStyle(fontSize: 18)),
            ),
          )
        ],
      ),
    );
  }
}
