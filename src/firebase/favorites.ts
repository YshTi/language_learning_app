import {
  get,
  ref,
  remove,
  set,
} from "firebase/database";

import { database } from "./firebase";

export const getFavorites = async (
  userId: string
): Promise<string[]> => {
  const favoritesRef = ref(
    database,
    `users/${userId}/favorites`
  );

  const snapshot = await get(favoritesRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.keys(data);
};

export const addFavorite = async (
  userId: string,
  teacherId: string
) => {
  const favoriteRef = ref(
    database,
    `users/${userId}/favorites/${teacherId}`
  );

  await set(favoriteRef, true);
};

export const removeFavorite = async (
  userId: string,
  teacherId: string
) => {
  const favoriteRef = ref(
    database,
    `users/${userId}/favorites/${teacherId}`
  );

  await remove(favoriteRef);
};