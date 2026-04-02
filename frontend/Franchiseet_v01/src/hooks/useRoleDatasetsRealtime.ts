import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  roleFromData,
  timestampToMillis,
  type AppRole,
  type FirestoreUserProfile,
} from '../services/userProfile';

interface DatasetRow extends FirestoreUserProfile {
  id: string;
  updatedAtMs: number;
  createdAtMs: number;
}

interface RealtimeState {
  data: DatasetRow[];
  loading: boolean;
  error: string | null;
}

const INITIAL_SNAPSHOT_TIMEOUT_MS = 12000;

function mapRealtimeError(error: unknown): string {
  const firestoreError = error as { code?: string; message?: string };
  const code = firestoreError?.code || '';

  if (code === 'permission-denied') {
    return 'Permission denied while reading live matches. Please verify Firestore rules.';
  }

  if (code === 'unavailable') {
    return 'Live matches are temporarily unavailable. Please check your network and try again.';
  }

  if (code === 'unauthenticated') {
    return 'Authentication expired while loading live matches. Please sign in again.';
  }

  return firestoreError?.message || 'Realtime listener failed.';
}

function useRoleDatasetRealtime(collectionName: 'franchisors' | 'franchisees', expectedRole: AppRole): RealtimeState {
  const [state, setState] = useState<RealtimeState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let hasReceivedFirstSnapshot = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      console.info(`[realtime] subscribing to ${collectionName} for role=${expectedRole}`);

      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot: any) => {
          hasReceivedFirstSnapshot = true;
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          const mapped = snapshot.docs
            .map((snap: any) => {
              const raw = snap.data();
              const role = roleFromData(raw);

              if (role !== expectedRole) {
                return null;
              }

              const updatedAtMs = timestampToMillis(raw.updatedAt);
              const createdAtMs = timestampToMillis(raw.createdAt);

              return {
                id: snap.id,
                uid: String(raw.uid ?? snap.id),
                email: String(raw.email ?? ''),
                displayName: String(raw.displayName ?? ''),
                role,
                photoURL: raw.photoURL ? String(raw.photoURL) : null,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                lastLoginAt: raw.lastLoginAt,
                updatedAtMs,
                createdAtMs,
              } satisfies DatasetRow;
            })
            .filter((item: DatasetRow | null): item is DatasetRow => item !== null)
            .sort((a: DatasetRow, b: DatasetRow) => {
              const aScore = a.updatedAtMs || a.createdAtMs;
              const bScore = b.updatedAtMs || b.createdAtMs;
              return bScore - aScore;
            });

          console.info(
            `[realtime] ${collectionName} snapshot received docs=${snapshot.size} mapped=${mapped.length}`,
          );

          setState({
            data: mapped,
            loading: false,
            error: null,
          });
        },
        (error: any) => {
          hasReceivedFirstSnapshot = true;
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          const message = mapRealtimeError(error);
          console.error(`[realtime] ${collectionName} listener error`, {
            code: error?.code,
            message: error?.message,
          });

          setState({
            data: [],
            loading: false,
            error: message,
          });
        },
      );

      timeoutId = setTimeout(() => {
        if (hasReceivedFirstSnapshot) {
          return;
        }

        console.error(`[realtime] ${collectionName} initial snapshot timeout`);
        setState({
          data: [],
          loading: false,
          error: 'Live match feed timed out. Check network/Firestore config and retry.',
        });
      }, INITIAL_SNAPSHOT_TIMEOUT_MS);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        unsubscribe();
      };
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const message = mapRealtimeError(error);
      console.error(`[realtime] ${collectionName} listener setup failed`, error);
      setState({
        data: [],
        loading: false,
        error: message,
      });

      return () => {};
    }
  }, [collectionName, expectedRole]);

  return state;
}

export function useFranchisorsRealtime(): RealtimeState {
  return useRoleDatasetRealtime('franchisors', 'franchisor');
}

export function useFranchiseesRealtime(): RealtimeState {
  return useRoleDatasetRealtime('franchisees', 'franchisee');
}
