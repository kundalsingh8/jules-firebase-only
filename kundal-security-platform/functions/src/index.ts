import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';

const KUNDAL_INIT_SECRET = defineSecret('KUNDAL_INIT_SECRET');

admin.initializeApp();

// ----------------------------------------------------------------------------
// Authentication & Role Management
// ----------------------------------------------------------------------------

export const assignRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const callerRecord = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerRecord.customClaims || {};

  if (callerClaims.role !== 'super_admin' && callerClaims.role !== 'company_admin' && callerClaims.role !== 'society_admin') {
     throw new functions.https.HttpsError('permission-denied', 'Only admins can assign roles');
  }

  const { targetUid, role, societyId } = data;

  if (!targetUid || !role) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing targetUid or role');
  }

  // Basic RBAC guard: Society admins can only assign roles within their society
  if (callerClaims.role === 'society_admin' && callerClaims.societyId !== societyId) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot assign role for another society');
  }

  const claims: any = { role };
  if (societyId) claims.societyId = societyId;

  await admin.auth().setCustomUserClaims(targetUid, claims);

  await admin.firestore().collection('users').doc(targetUid).set({
      role,
      societyId: societyId || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return { success: true, message: `Role ${role} assigned successfully` };
});

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
    const defaultRole = 'resident'; // Default, requires verification/assignment

    await admin.firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        phoneNumber: user.phoneNumber || null,
        email: user.email || null,
        displayName: user.displayName || null,
        role: defaultRole,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await admin.auth().setCustomUserClaims(user.uid, { role: defaultRole });
});

// ----------------------------------------------------------------------------
// Visitor Management Cloud Functions
// ----------------------------------------------------------------------------

export const notifyResidentOnVisitorEntry = functions.firestore
    .document('societies/{societyId}/visitors/{visitorId}')
    .onCreate(async (snap, context) => {
        const visitorData = snap.data();
        const societyId = context.params.societyId;

        if (visitorData.status === 'pending_approval') {
            // Get flat details to find residentIds
            const flatRef = admin.firestore().doc(`societies/${societyId}/flats/${visitorData.flatId}`);
            const flatDoc = await flatRef.get();

            if (flatDoc.exists) {
                const residentIds = flatDoc.data()?.residentIds || [];

                // Fetch FCM tokens for residents
                const tokens: string[] = [];
                for (const rId of residentIds) {
                    const userDoc = await admin.firestore().collection('users').doc(rId).get();
                    const userTokens = userDoc.data()?.fcmTokens || [];
                    tokens.push(...userTokens);
                }

                if (tokens.length > 0) {
                    const payload = {
                        notification: {
                            title: 'New Visitor',
                            body: `${visitorData.name} is at the gate. Approve or Reject?`,
                        },
                        data: {
                            visitorId: context.params.visitorId,
                            action: 'visitor_approval'
                        }
                    };
                    await admin.messaging().sendToDevice(tokens, payload);
                }
            }
        }
    });

// ----------------------------------------------------------------------------
// Helper/Mock Endpoints
// ----------------------------------------------------------------------------

export const setupSuperAdmin = functions.runWith({ secrets: [KUNDAL_INIT_SECRET] }).https.onRequest(async (req, res) => {
    const secret = req.query.secret;
    if (secret !== KUNDAL_INIT_SECRET.value()) {
        res.status(403).send('Forbidden');
        return;
    }

    const { uid } = req.body;
    if (!uid) {
        res.status(400).send('Missing uid');
        return;
    }

    await admin.auth().setCustomUserClaims(uid, { role: 'super_admin' });
    await admin.firestore().collection('users').doc(uid).set({
        role: 'super_admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.send({ success: true, message: 'Super admin created' });
});
