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

function useRoleDatasetRealtime(collectionName: 'franchisors' | 'franchisees', expectedRole: AppRole): RealtimeState {
  const [state, setState] = useState<RealtimeState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot: any) => {
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

        setState({
          data: mapped,
          loading: false,
          error: null,
        });
      },
      (error: any) => {
        setState({
          data: [],
          loading: false,
          error: error.message || 'Realtime listener failed',
        });
      },
    );

    return () => unsubscribe();
  }, [collectionName, expectedRole]);

  return state;
}

export function useFranchisorsRealtime(): RealtimeState {
  return useRoleDatasetRealtime('franchisors', 'franchisor');
}

export function useFranchiseesRealtime(): RealtimeState {
  return useRoleDatasetRealtime('franchisees', 'franchisee');
}
