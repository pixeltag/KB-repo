import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { kbApi } from '../api/kb'
import type { KnowledgeBase } from '../api/types'
import { KnowledgeBasesContext } from './knowledgeBasesContext'

export function KnowledgeBasesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await kbApi.listKnowledgeBases()
      setItems(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load knowledge bases')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upsert = useCallback((kb: KnowledgeBase) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === kb.id)
      if (idx === -1) return [kb, ...prev]
      const next = prev.slice()
      next[idx] = kb
      return next
    })
  }, [])

  const remove = useCallback((kbId: string) => {
    setItems((prev) => prev.filter((x) => x.id !== kbId))
  }, [])

  const value = useMemo(
    () => ({ items, loading, error, refresh, upsert, remove }),
    [items, loading, error, refresh, upsert, remove],
  )

  return <KnowledgeBasesContext value={value}>{children}</KnowledgeBasesContext>
}
