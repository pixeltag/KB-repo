export type ToastKind = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  kind: ToastKind
  message: string
  title?: string
  createdAt: number
  timeoutMs: number
}

type ToastInput = {
  kind: ToastKind
  message: string
  title?: string
  timeoutMs?: number
}

type Listener = (toasts: Toast[]) => void

let toasts: Toast[] = []
const listeners = new Set<Listener>()

function notify() {
  for (const l of listeners) l(toasts)
}

function add(input: ToastInput) {
  const t: Toast = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    kind: input.kind,
    message: input.message,
    title: input.title,
    createdAt: Date.now(),
    timeoutMs: input.timeoutMs ?? 4500,
  }
  toasts = [t, ...toasts].slice(0, 5)
  notify()

  window.setTimeout(() => {
    remove(t.id)
  }, t.timeoutMs)
}

export function remove(id: string) {
  const next = toasts.filter((t) => t.id !== id)
  if (next.length === toasts.length) return
  toasts = next
  notify()
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  listener(toasts)
  return () => {
    listeners.delete(listener)
  }
}

export const toast = {
  success: (message: string, opts?: Omit<ToastInput, 'kind' | 'message'>) =>
    add({ kind: 'success', message, ...opts }),
  error: (message: string, opts?: Omit<ToastInput, 'kind' | 'message'>) =>
    add({ kind: 'error', message, ...opts }),
  info: (message: string, opts?: Omit<ToastInput, 'kind' | 'message'>) =>
    add({ kind: 'info', message, ...opts }),
}

