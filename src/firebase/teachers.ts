import { get, ref } from "firebase/database";
import { database } from "./firebase";

export const getTeachers = async () => {
  const teachersRef = ref(database, "teachers");
  const snapshot = await get(teachersRef);

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.val();
};