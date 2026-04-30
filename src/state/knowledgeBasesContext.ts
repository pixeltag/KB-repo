import { createContext } from 'react'
import type { KnowledgeBase } from '../api/types'

export type KnowledgeBasesState = {
  items: KnowledgeBase[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  upsert: (kb: KnowledgeBase) => void
  remove: (kbId: string) => void
}

export const KnowledgeBasesContext = createContext<KnowledgeBasesState | null>(null)

