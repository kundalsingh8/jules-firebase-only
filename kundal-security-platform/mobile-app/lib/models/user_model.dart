class UserModel {
  final String id;
  final String role;
  final String? email;
  final String? societyId;

  UserModel({
    required this.id,
    required this.role,
    this.email,
    this.societyId,
  });

  factory UserModel.fromMap(Map<String, dynamic> map, String docId) {
    return UserModel(
      id: docId,
      role: map['role'] ?? 'resident',
      email: map['email'],
      societyId: map['societyId'],
    );
  }
}
