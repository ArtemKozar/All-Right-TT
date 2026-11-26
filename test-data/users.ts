import { requireEnv } from '../utils/env.ts';

export type Credentials = {
  readonly username: string;
  readonly password: string;
};

// Read on use, not on import, so a missing value fails only the tests that need it.
export const standardUser: Credentials = {
  get username(): string {
    return requireEnv('SAUCE_USERNAME');
  },
  get password(): string {
    return requireEnv('SAUCE_PASSWORD');
  },
};

export const bookerAdmin: Credentials = {
  get username(): string {
    return requireEnv('BOOKER_USERNAME');
  },
  get password(): string {
    return requireEnv('BOOKER_PASSWORD');
  },
};

export const wrongPassword = 'wrong_password';
