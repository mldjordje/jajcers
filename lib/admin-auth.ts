export const ADMIN_AUTH_COOKIE = 'jajce_admin_auth';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';
const ADMIN_AUTH_TOKEN = process.env.ADMIN_AUTH_TOKEN ?? 'dev-admin-token-change-me';

export function isValidAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAdminAuthToken(): string {
  return ADMIN_AUTH_TOKEN;
}
