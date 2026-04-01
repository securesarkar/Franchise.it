import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { roleFromData } from './userProfile';

export interface BackfillSummary {
  migrated: number;
  skipped: number;
  skippedUids: string[];
}

// Minimal migration utility for one-time backfill: users/{uid} -> role collection.
export async function backfillRoleCollectionsFromUsers(): Promise<BackfillSummary> {
  const usersSnap = await getDocs(collection(db, 'users'));
  let migrated = 0;
  let skipped = 0;
  const skippedUids: string[] = [];

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const data = userDoc.data();
    const role = roleFromData(data);

    if (!role) {
      skipped += 1;
      skippedUids.push(uid);
      // Keep a clear audit trail in dev tools/logs.
      console.warn(`Skipping user ${uid}: missing or invalid role`);
      continue;
    }

    const targetCollection = role === 'franchisor' ? 'franchisors' : 'franchisees';
    const targetRef = doc(db, targetCollection, uid);

    await setDoc(
      targetRef,
      {
        uid,
        email: String(data.email ?? ''),
        displayName: String(data.displayName ?? ''),
        role,
        photoURL: data.photoURL ? String(data.photoURL) : null,
        createdAt: data.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: data.lastLoginAt ?? serverTimestamp(),
        datasetRole: role,
      },
      { merge: true },
    );

    migrated += 1;
  }

  return {
    migrated,
    skipped,
    skippedUids,
  };
}
