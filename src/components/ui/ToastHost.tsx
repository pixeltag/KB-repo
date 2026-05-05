import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { remove, subscribe, type Toast } from '../../lib/toast'

function kindClasses(kind: Toast['kind']) {
  switch (kind) {
    case 'success':
      return {
        wrap: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
        dot: 'bg-emerald-500',
      }
    case 'info':
      return {
        wrap: 'border-slate-200 bg-white/90 text-slate-900',
        dot: 'bg-slate-400',
      }
    case 'error':
    default:
      return {
        wrap: 'border-red-200 bg-red-50/90 text-red-900',
        dot: 'bg-red-500',
      }
  }
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return subscribe(setToasts)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-[360px] max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => {
        const c = kindClasses(t.kind)
        return (
          <div
            key={t.id}
            className={`backdrop-blur-md border shadow-lg rounded-xl px-4 py-3 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-200 ${c.wrap}`}
            role="status"
            aria-live="polite"
          >
            <div className="mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <div className="text-sm font-semibold leading-tight">{t.title}</div>}
              <div className="text-sm leading-snug break-words">{t.message}</div>
            </div>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="p-1 rounded-md hover:bg-black/5 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

