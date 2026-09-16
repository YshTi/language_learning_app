import {
  get,
  limitToFirst,
  orderByKey,
  query,
  ref,
  startAfter,
} from "firebase/database";

import { database } from "./firebase";

import type { Teacher } from "../types/teacher";

const PAGE_SIZE = 4;

export interface TeachersPageResult {
  teachers: Teacher[];
  lastKey: string | null;
  hasMore: boolean;
}

export const getTeachersPage = async (
  lastKey: string | null = null
): Promise<TeachersPageResult> => {
  const teachersRef = ref(database, "teachers");

  const teachersQuery = lastKey
    ? query(
        teachersRef,
        orderByKey(),
        startAfter(lastKey),
        limitToFirst(PAGE_SIZE + 1)
      )
    : query(
        teachersRef,
        orderByKey(),
        limitToFirst(PAGE_SIZE + 1)
      );

  const snapshot = await get(teachersQuery);

  if (!snapshot.exists()) {
    return {
      teachers: [],
      lastKey: null,
      hasMore: false,
    };
  }

  const data = snapshot.val();

  const entries = Object.entries(data);

  const hasMore = entries.length > PAGE_SIZE;

  const pageEntries = entries.slice(0, PAGE_SIZE);

  const teachers = pageEntries.map(([id, teacher]) => ({
    id,
    ...(teacher as Omit<Teacher, "id">),
  }));

  const newLastKey =
    pageEntries.length > 0
      ? pageEntries[pageEntries.length - 1][0]
      : null;

  return {
    teachers,
    lastKey: newLastKey,
    hasMore,
  };
};