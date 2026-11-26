import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Local runs read credentials from .env; CI passes them as environment variables.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: ci ? 2 : undefined,
  // A failure is reported, never retried into a green run.
  retries: 0,
  forbidOnly: ci,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: ci
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    // Failures are debugged with the trace viewer.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
        // Sauce Demo marks its elements with data-test, not data-testid.
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
