import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/shift_provider.dart';
import 'patrol_view.dart';
import 'incident_report_view.dart';

class GuardDashboard extends StatefulWidget {
  const GuardDashboard({super.key});

  @override
  State<GuardDashboard> createState() => _GuardDashboardState();
}

class _GuardDashboardState extends State<GuardDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      if (auth.currentUser != null) {
        context.read<ShiftProvider>().checkCurrentShift(auth.currentUser!.uid);
      }
    });
  }

  void _showClockInDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clock In'),
        content: const Text('Ensure you are on site and ready to take a selfie.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              // In real app, navigate to Camera View first.
              final auth = context.read<AuthProvider>();
              final shift = context.read<ShiftProvider>();
              if (auth.currentUser != null) {
                // Mock society ID for now
                await shift.clockIn(auth.currentUser!.uid, auth.userModel?.societyId ?? 'society_1', null);
              }
            },
            child: const Text('Proceed'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final shiftProvider = context.watch<ShiftProvider>();
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guard Dashboard', style: TextStyle(color: Colors.white)),
        backgroundColor: Theme.of(context).colorScheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => authProvider.signOut(),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Shift Status Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Text(
                      'Current Shift Status',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    shiftProvider.isLoading
                        ? const CircularProgressIndicator()
                        : Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: shiftProvider.isOnShift ? Colors.green.shade100 : Colors.red.shade100,
                              borderRadius: BorderRadius.circular(20)
                            ),
                            child: Text(
                              shiftProvider.isOnShift ? 'ON DUTY' : 'OFF DUTY',
                              style: TextStyle(
                                color: shiftProvider.isOnShift ? Colors.green.shade800 : Colors.red.shade800,
                                fontWeight: FontWeight.bold,
                                fontSize: 18
                              ),
                            ),
                          ),
                    const SizedBox(height: 24),
                    shiftProvider.isOnShift
                        ? ElevatedButton.icon(
                            onPressed: () => shiftProvider.clockOut(),
                            icon: const Icon(Icons.timer_off),
                            label: const Text('Clock Out'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red.shade600,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24)
                            ),
                          )
                        : ElevatedButton.icon(
                            onPressed: () => _showClockInDialog(context),
                            icon: const Icon(Icons.timer),
                            label: const Text('Clock In'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(context).colorScheme.secondary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24)
                            ),
                          ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Actions Grid
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildActionCard(
                    context,
                    'Start Patrol',
                    Icons.directions_walk,
                    Colors.blue,
                    shiftProvider.isOnShift ? () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PatrolView())) : null,
                  ),
                  _buildActionCard(
                    context,
                    'Report Incident',
                    Icons.warning_amber_rounded,
                    Colors.orange,
                    shiftProvider.isOnShift ? () => Navigator.push(context, MaterialPageRoute(builder: (_) => const IncidentReportView())) : null,
                  ),
                  _buildActionCard(
                    context,
                    'Visitor Log',
                    Icons.people,
                    Colors.purple,
                    shiftProvider.isOnShift ? () {} : null, // Placeholder
                  ),
                  _buildActionCard(
                    context,
                    'Tasks',
                    Icons.checklist,
                    Colors.teal,
                    shiftProvider.isOnShift ? () {} : null, // Placeholder
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, String title, IconData icon, Color color, VoidCallback? onTap) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Opacity(
          opacity: onTap == null ? 0.5 : 1.0,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: color),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
