const DEFAULT_API_BASE = 'https://api.jajce.rs/api';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getPhpApiBaseUrl(): string {
  const configured =
    process.env.PHP_API_BASE?.trim() ||
    process.env.NEXT_PUBLIC_PHP_API_BASE?.trim() ||
    DEFAULT_API_BASE;

  return trimTrailingSlash(configured);
}

export function buildPhpApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${getPhpApiBaseUrl()}/${normalizedPath}`;
}

export async function fetchPhpApiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildPhpApiUrl(path), {
    ...init,
    cache: init?.cache ?? 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PHP API ${path} failed (${response.status}): ${body.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}
