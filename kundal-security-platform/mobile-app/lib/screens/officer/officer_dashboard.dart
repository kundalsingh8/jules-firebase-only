import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../providers/auth_provider.dart';

class OfficerDashboard extends StatelessWidget {
  const OfficerDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Officer Monitoring', style: TextStyle(color: Colors.white)),
        backgroundColor: Theme.of(context).colorScheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => authProvider.signOut(),
          )
        ],
      ),
      body: DefaultTabController(
        length: 2,
        child: Column(
          children: [
            const TabBar(
              tabs: [
                Tab(text: 'Active Shifts'),
                Tab(text: 'Recent Incidents'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _ActiveShiftsList(),
                  _RecentIncidentsList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActiveShiftsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('attendance')
          .where('status', isEqualTo: 'active')
          .orderBy('clockInTime', descending: true)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.hasError) return Center(child: Text('Error: \${snapshot.error}'));
        if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());

        final docs = snapshot.data?.docs ?? [];
        if (docs.isEmpty) return const Center(child: Text('No active shifts'));

        return ListView.builder(
          itemCount: docs.length,
          itemBuilder: (context, index) {

            return ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person)),
              title: Text("Guard ID: \${((docs[index].data() as Map<String, dynamic>))['guardId'] ?? 'Unknown'}"),
              subtitle: Text("Site: \${((docs[index].data() as Map<String, dynamic>))['societyId']} \nClock In: \${(((docs[index].data() as Map<String, dynamic>))['clockInTime'] is Timestamp) ? (((docs[index].data() as Map<String, dynamic>))['clockInTime'] as Timestamp).toDate().toString() : 'Offline sync pending'}"),
              trailing: const Icon(Icons.circle, color: Colors.green, size: 12),
              isThreeLine: true,
            );
          },
        );
      },
    );
  }
}

class _RecentIncidentsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      // Listen to last 50 incidents for this officer's area
      stream: FirebaseFirestore.instance
          .collection('incidents')
          .orderBy('timestamp', descending: true)
          .limit(50)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.hasError) return Center(child: Text('Error: \${snapshot.error}'));
        if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());

        final docs = snapshot.data?.docs ?? [];
        if (docs.isEmpty) return const Center(child: Text('No recent incidents'));

        return ListView.builder(
          itemCount: docs.length,
          itemBuilder: (context, index) {
            final dataMap2 = docs[index].data() as Map<String, dynamic>;

            Color getSeverityColor(String? sev) {
              switch(sev) {
                case 'critical': return Colors.red.shade900;
                case 'high': return Colors.red;
                case 'medium': return Colors.orange;
                case 'low': return Colors.yellow.shade700;
                default: return Colors.grey;
              }
            }

            return Card(
              margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: ListTile(
                leading: Icon(Icons.warning, color: getSeverityColor(dataMap2['severity'] as String?)),
                title: Text((dataMap2['type'] as String? ?? 'Unknown').replaceAll('_', ' ').toUpperCase()),
                subtitle: Text((dataMap2['description'] as String?) ?? ''),
                trailing: Text(
                  (dataMap2['status'] as String?)?.toUpperCase() ?? '',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: dataMap2['status'] == 'open' ? Colors.red : Colors.green
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
