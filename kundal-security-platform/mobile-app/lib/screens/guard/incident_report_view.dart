import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/location_service.dart';
import '../../services/sync_service.dart';

class IncidentReportView extends StatefulWidget {
  const IncidentReportView({super.key});

  @override
  State<IncidentReportView> createState() => _IncidentReportViewState();
}

class _IncidentReportViewState extends State<IncidentReportView> {
  final _formKey = GlobalKey<FormState>();
  String _type = 'suspicious_activity';
  String _severity = 'low';
  final _descriptionController = TextEditingController();
  bool _isSubmitting = false;

  final List<String> _incidentTypes = [
    'suspicious_activity',
    'theft',
    'vandalism',
    'medical_emergency',
    'fire',
    'other'
  ];

  final List<String> _severities = ['low', 'medium', 'high', 'critical'];

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final location = await LocationService.getCurrentLocation();
      final auth = context.read<AuthProvider>();

      final reportData = {
        'type': _type,
        'severity': _severity,
        'description': _descriptionController.text.trim(),
        'reportedBy': auth.currentUser?.uid,
        'societyId': auth.userModel?.societyId,
        'status': 'open',
        'timestamp': DateTime.now().toIso8601String(),
        'location': location != null ? {'lat': location.latitude, 'lng': location.longitude} : null,
      };

      final syncService = SyncService();
      await syncService.init();
      await syncService.enqueueOperation('incidents', 'add', reportData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Incident reported successfully'), backgroundColor: Colors.green),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: \$e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Incident'),
        backgroundColor: Colors.orange.shade700,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Incident Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        initialValue: _type,
                        decoration: const InputDecoration(labelText: 'Incident Type', border: OutlineInputBorder()),
                        items: _incidentTypes.map((type) {
                          return DropdownMenuItem(
                            value: type,
                            child: Text(type.replaceAll('_', ' ').toUpperCase()),
                          );
                        }).toList(),
                        onChanged: (val) => setState(() => _type = val!),
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        initialValue: _severity,
                        decoration: const InputDecoration(labelText: 'Severity', border: OutlineInputBorder()),
                        items: _severities.map((sev) {
                          return DropdownMenuItem(
                            value: sev,
                            child: Text(sev.toUpperCase()),
                          );
                        }).toList(),
                        onChanged: (val) => setState(() => _severity = val!),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _descriptionController,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          labelText: 'Description',
                          border: OutlineInputBorder(),
                          alignLabelWithHint: true,
                        ),
                        validator: (v) => v!.isEmpty ? 'Please describe the incident' : null,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange.shade700,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: _isSubmitting ? null : _submitReport,
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('SUBMIT REPORT', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
