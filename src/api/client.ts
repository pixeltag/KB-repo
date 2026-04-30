export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

function getApiBaseUrl() {
  // In dev, `vite.config.ts` proxies `/api` to the backend.
  // In prod, you can set VITE_API_BASE_URL to the full origin.
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  return base ? base.replace(/\/$/, '') : ''
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)

  let body: BodyInit | undefined
  if (options.body instanceof FormData) {
    body = options.body
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get('content-type') ?? ''
  const parsed = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const msg =
      typeof parsed === 'string'
        ? parsed
        : typeof parsed === 'object' && parsed !== null && 'detail' in parsed
          ? String((parsed as { detail?: unknown }).detail ?? res.statusText)
          : res.statusText
    throw new ApiError(String(msg), res.status, parsed)
  }

  return parsed as T
}

