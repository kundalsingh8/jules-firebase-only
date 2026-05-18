import * as admin from 'firebase-admin';

// This is a utility script meant to be run once a live project exists
// or when the local emulators are running.
export async function addAdmin(email: string) {
  try {
    let uid;
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      uid = userRecord.uid;
      console.log(`User found with UID: ${uid}`);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found. Creating user...');
        const userRecord = await admin.auth().createUser({
          email: email,
          emailVerified: true,
          password: 'Password123!',
        });
        uid = userRecord.uid;
        console.log(`Successfully created new user with UID: ${uid}`);
      } else {
        throw error;
      }
    }

    await admin.auth().setCustomUserClaims(uid, { role: 'super_admin' });
    console.log(`Successfully set super_admin custom claim for user ${email}`);

    await admin.firestore().collection('users').doc(uid).set({
      email: email,
      role: 'super_admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`Successfully updated Firestore document for user ${email}`);

  } catch (error) {
    console.error('Error making user admin:', error);
  }
}
