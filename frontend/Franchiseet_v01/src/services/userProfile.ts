import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AppRole = 'franchisor' | 'franchisee';

export interface UpsertUserProfileParams {
  uid: string;
  email: string;
  displayName: string;
  role: AppRole;
  photoURL?: string | null;
}

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AppRole;
  photoURL: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

const VALID_ROLES: AppRole[] = ['franchisor', 'franchisee'];

function assertRole(role: string): asserts role is AppRole {
  if (!VALID_ROLES.includes(role as AppRole)) {
    throw new Error("Invalid role. Expected 'franchisor' or 'franchisee'.");
  }
}

function buildPayload(
  params: UpsertUserProfileParams,
  existingCreatedAt: unknown,
): DocumentData {
  const now = serverTimestamp();
  return {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    role: params.role,
    photoURL: params.photoURL ?? null,
    createdAt: existingCreatedAt ?? now,
    updatedAt: now,
    lastLoginAt: now,
  };
}

export async function upsertUserProfile(params: UpsertUserProfileParams): Promise<void> {
  assertRole(params.role);

  const userRef = doc(db, 'users', params.uid);
  const roleCollection = params.role === 'franchisor' ? 'franchisors' : 'franchisees';
  const roleRef = doc(db, roleCollection, params.uid);

  const [existingUserSnap, existingRoleSnap] = await Promise.all([getDoc(userRef), getDoc(roleRef)]);

  const existingUserCreatedAt = existingUserSnap.exists()
    ? existingUserSnap.data().createdAt
    : undefined;
  const existingRoleCreatedAt = existingRoleSnap.exists()
    ? existingRoleSnap.data().createdAt
    : undefined;

  const userPayload = buildPayload(params, existingUserCreatedAt);
  const rolePayload = {
    ...buildPayload(params, existingRoleCreatedAt),
    datasetRole: params.role,
  };

  await Promise.all([
    setDoc(userRef, userPayload, { merge: true }),
    setDoc(roleRef, rolePayload, { merge: true }),
  ]);
}

export async function getUserRoleByUid(uid: string): Promise<AppRole | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    return null;
  }

  const role = snap.data().role;
  if (role === 'franchisor' || role === 'franchisee') {
    return role;
  }

  return null;
}

export function timestampToMillis(value: unknown): number {
  if (!value) return 0;

  const timestamp = value as {
    toMillis?: () => number;
    seconds?: number;
    nanoseconds?: number;
  };

  if (typeof timestamp.toMillis === 'function') {
    return timestamp.toMillis();
  }

  if (typeof timestamp.seconds === 'number') {
    return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds ?? 0) / 1_000_000);
  }

  return 0;
}

export function roleFromData(data: { role?: unknown }): AppRole | null {
  if (data.role === 'franchisor' || data.role === 'franchisee') {
    return data.role;
  }

  return null;
}
