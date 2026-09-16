import { get, ref } from "firebase/database";

import { database } from "./firebase";

import type { Teacher } from "../types/teacher";

export const getAllTeachers = async (): Promise<Teacher[]> => {
  const teachersRef = ref(database, "teachers");

  const snapshot = await get(teachersRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, teacher]) => ({
    id,
    ...(teacher as Omit<Teacher, "id">),
  }));
};