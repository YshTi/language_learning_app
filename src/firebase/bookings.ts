import {
  push,
  ref,
  set,
} from "firebase/database";

import { database } from "./firebase";

interface BookingData {
  teacherId: string;
  teacherName: string;
  language: string;
  reason: string;
  name: string;
  email: string;
  phone: string;
}

export const createBooking = async (
  booking: BookingData
) => {
  const bookingsRef = ref(database, "bookings");

  const newBookingRef = push(bookingsRef);

  await set(newBookingRef, {
    ...booking,
    createdAt: Date.now(),
  });

  return newBookingRef.key;
};