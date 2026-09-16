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

export interface TeachersPageResult {
  teachers: Teacher[];
  lastKey: string | null;
}

const mapTeachers = (data: Record<string, Omit<Teacher, "id">>): Teacher[] => {
  return Object.entries(data).map(([id, teacher]) => ({
    id,
    ...teacher,
  }));
};

export const getAllTeachers = async (): Promise<Teacher[]> => {
  const teachersRef = ref(database, "teachers");

  const snapshot = await get(teachersRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val() as Record<string, Omit<Teacher, "id">>;

  return mapTeachers(data);
};

export const getTeachersPage = async (
  pageSize = 4,
  startAfterKey?: string | null,
): Promise<TeachersPageResult> => {
  const teachersRef = ref(database, "teachers");

  const teachersQuery = startAfterKey
    ? query(
        teachersRef,
        orderByKey(),
        startAfter(startAfterKey),
        limitToFirst(pageSize),
      )
    : query(teachersRef, orderByKey(), limitToFirst(pageSize));

  const snapshot = await get(teachersQuery);

  if (!snapshot.exists()) {
    return {
      teachers: [],
      lastKey: null,
    };
  }

  const data = snapshot.val() as Record<string, Omit<Teacher, "id">>;

  const teachers = mapTeachers(data);

  const lastTeacher = teachers[teachers.length - 1];

  return {
    teachers,
    lastKey: lastTeacher?.id ?? null,
  };
};
