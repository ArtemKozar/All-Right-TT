export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}: set it in .env (see .env.example) or in the CI secrets.`);
  }
  return value;
}
