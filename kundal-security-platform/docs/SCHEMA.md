# Firestore Schema Design

## Collections Overview

### `users` (Collection)
Global user collection for authentication and basic profile.
- `uid` (string) - Document ID (matches Firebase Auth UID)
- `phoneNumber` (string)
- `email` (string, optional)
- `displayName` (string)
- `role` (string) - super_admin, company_admin, society_admin, guard_supervisor, guard, resident, vendor
- `societyId` (string, optional) - Which society they belong to
- `flats` (array of maps) - For residents: `[{ towerId: "T1", flatId: "101", type: "owner" }]`
- `createdAt` (timestamp)
- `fcmTokens` (array of strings)

### `societies` (Collection)
- `id` (string) - Document ID
- `name` (string)
- `address` (string)
- `city` (string)
- `state` (string)
- `pinCode` (string)
- `contactNumber` (string)
- `billingPlan` (string)
- `createdAt` (timestamp)

#### `societies/{societyId}/towers` (Subcollection)
- `id` (string) - Document ID
- `name` (string)
- `totalFloors` (number)

#### `societies/{societyId}/flats` (Subcollection)
- `id` (string) - Document ID
- `towerId` (string)
- `flatNumber` (string)
- `floor` (number)
- `occupancyStatus` (string) - vacant, occupied
- `residentIds` (array of strings)

#### `societies/{societyId}/visitors` (Subcollection)
- `id` (string) - Document ID
- `name` (string)
- `phoneNumber` (string)
- `visitorType` (string) - guest, delivery, cab, vendor, etc.
- `towerId` (string)
- `flatId` (string)
- `photoUrl` (string)
- `status` (string) - pending_approval, approved, rejected, entered, exited
- `entryTime` (timestamp, optional)
- `exitTime` (timestamp, optional)
- `enteredBy` (userId of Guard)
- `approvedBy` (userId of Resident)

#### `societies/{societyId}/attendance` (Subcollection)
- `id` (string) - Document ID
- `userId` (string) - Guard or Staff ID
- `date` (string) - YYYY-MM-DD
- `shiftId` (string)
- `checkInTime` (timestamp)
- `checkOutTime` (timestamp, optional)
- `verifiedBy` (userId)

#### `societies/{societyId}/incidents` (Subcollection)
- `id` (string) - Document ID
- `title` (string)
- `description` (string)
- `type` (string) - theft, fire, medical, other
- `severity` (string) - low, medium, high, critical
- `reportedBy` (userId)
- `timestamp` (timestamp)
- `status` (string) - open, investigated, resolved
- `mediaUrls` (array of strings)

#### `societies/{societyId}/parcels` (Subcollection)
- `id` (string) - Document ID
- `courierCompany` (string) - Amazon, Flipkart, etc.
- `towerId` (string)
- `flatId` (string)
- `receivedAt` (timestamp)
- `receivedBy` (userId - Guard)
- `status` (string) - at_gate, collected
- `collectedAt` (timestamp, optional)
- `collectionOtp` (string, hashed)

#### `societies/{societyId}/patrols` (Subcollection)
- `id` (string) - Document ID
- `guardId` (string)
- `shiftId` (string)
- `startTime` (timestamp)
- `endTime` (timestamp, optional)
- `checkpoints` (array of maps) - `[{ checkpointId: "CP1", scannedAt: timestamp, status: "completed" }]`

#### `societies/{societyId}/shifts` (Subcollection)
- `id` (string) - Document ID
- `name` (string) - "Morning", "Evening", "Night"
- `startTime` (string) - HH:MM
- `endTime` (string) - HH:MM
- `guardsRequired` (number)

#### `societies/{societyId}/staff` (Subcollection)
- `id` (string) - Document ID
- `userId` (string, optional) - if they use the app
- `name` (string)
- `type` (string) - maid, driver, cook, tutor, housekeeping
- `phoneNumber` (string)
- `photoUrl` (string)
- `idDocumentUrl` (string)
- `flats` (array of maps) - `[{ towerId: "T1", flatId: "101" }]`
- `status` (string) - active, blocked
