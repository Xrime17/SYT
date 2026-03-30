import { CACHE_DISABLED } from '@/config';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const API_TIMEOUT_MS = 15000;

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string>; timeoutMs?: number }
): Promise<T> {
  const { params, timeoutMs, ...init } = options ?? {};
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs ?? API_TIMEOUT_MS);
  const hasBody = typeof init.body !== 'undefined' && init.body !== null;
  const mergedHeaders = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(init.headers ?? {}),
  };
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      ...init,
      signal: controller.signal,
      headers: mergedHeaders,
      ...(CACHE_DISABLED ? { cache: 'no-store' as const } : {}),
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Сервер не отвечает. Проверьте интернет.');
    }
    throw e;
  }
  clearTimeout(timeoutId);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return undefined as T;
}

export { request, API_BASE };
