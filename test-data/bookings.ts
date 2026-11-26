import { randomBytes } from 'node:crypto';
import type { Booking } from '../api/BookingApi.ts';

export const apiStatus = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
} as const;

// RFC 9110 expects 401 for a request without credentials; many APIs answer 403.
// Either is accepted: the test checks that the change is refused.
export const statusesRefusingMissingCredentials: number[] = [401, 403];

// Dates are relative to the run, so the data never ages.
function isoDateFromToday(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// The API is public and shared: a unique last name keeps each run's booking apart.
export function newBooking(): Booking {
  return {
    firstname: 'Test',
    lastname: `Guest-${randomBytes(4).toString('hex')}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: isoDateFromToday(30),
      checkout: isoDateFromToday(33),
    },
    additionalneeds: 'Breakfast',
  };
}

export function changedBooking(booking: Booking): Booking {
  return {
    ...booking,
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: isoDateFromToday(31),
      checkout: isoDateFromToday(34),
    },
    additionalneeds: 'Dinner',
  };
}

export const bookingWithoutRequiredFields: Partial<Booking> = {
  firstname: 'Test',
};
