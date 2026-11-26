import { test, expect } from '@playwright/test';
import { BookingApi } from '../../api/BookingApi.ts';
import type { CreatedBooking, Token } from '../../api/BookingApi.ts';
import { bookerAdmin, wrongPassword } from '../../test-data/users.ts';
import {
  apiStatus,
  bookingWithoutRequiredFields,
  changedBooking,
  newBooking,
  statusesRefusingMissingCredentials,
} from '../../test-data/bookings.ts';

test.describe('Booking API', () => {
  test('API-01 admin creates, updates and deletes a booking, then it is gone', { tag: ['@api', '@smoke'] }, async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const booking = newBooking();
    const changes = changedBooking(booking);

    const token = await test.step('get a token', async () => {
      const response = await bookingApi.createToken(bookerAdmin.username, bookerAdmin.password);
      expect(response.status()).toBe(apiStatus.ok);
      const body = (await response.json()) as Token;
      expect(body.token).toEqual(expect.any(String));
      return body.token;
    });

    const bookingId = await test.step('create a booking', async () => {
      const response = await bookingApi.createBooking(booking);
      expect(response.status()).toBe(apiStatus.ok);
      const body = (await response.json()) as CreatedBooking;
      expect(body.bookingid).toEqual(expect.any(Number));
      expect(body.booking).toEqual(booking);
      return body.bookingid;
    });

    await test.step('read the booking', async () => {
      const response = await bookingApi.getBooking(bookingId);
      expect(response.status()).toBe(apiStatus.ok);
      expect(await response.json()).toEqual(booking);
    });

    await test.step('update the booking', async () => {
      const response = await bookingApi.updateBooking(bookingId, changes, token);
      expect(response.status()).toBe(apiStatus.ok);
      expect(await response.json()).toEqual(changes);

      const stored = await bookingApi.getBooking(bookingId);
      expect(await stored.json()).toEqual(changes);
    });

    await test.step('delete the booking', async () => {
      const response = await bookingApi.deleteBooking(bookingId, token);
      expect(response.status()).toBe(apiStatus.created);
    });

    await test.step('check the booking is gone', async () => {
      const response = await bookingApi.getBooking(bookingId);
      expect(response.status()).toBe(apiStatus.notFound);
    });
  });

  test('API-02 token is refused for a wrong password', { tag: ['@api', '@negative'] }, async ({ request }) => {
    const bookingApi = new BookingApi(request);

    const response = await bookingApi.createToken(bookerAdmin.username, wrongPassword);

    expect(response.status()).toBe(apiStatus.unauthorized);
    expect(await response.text()).not.toContain('"token"');
  });

  test('API-03 booking cannot be updated without a token', { tag: ['@api', '@negative'] }, async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const booking = newBooking();
    const created = (await (await bookingApi.createBooking(booking)).json()) as CreatedBooking;

    const response = await bookingApi.updateBooking(created.bookingid, changedBooking(booking));

    expect(statusesRefusingMissingCredentials).toContain(response.status());
    const stored = await bookingApi.getBooking(created.bookingid);
    expect(await stored.json()).toEqual(booking);
  });

  test('API-04 booking without required fields is rejected with 400', { tag: ['@api', '@negative'] }, async ({ request }) => {
    const bookingApi = new BookingApi(request);

    const response = await bookingApi.createBooking(bookingWithoutRequiredFields);

    expect(response.status()).toBe(apiStatus.badRequest);
  });
});
