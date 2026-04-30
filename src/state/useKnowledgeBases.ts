import { useContext } from 'react'
import { KnowledgeBasesContext } from './knowledgeBasesContext'

export function useKnowledgeBases() {
  const ctx = useContext(KnowledgeBasesContext)
  if (!ctx) throw new Error('useKnowledgeBases must be used within KnowledgeBasesProvider')
  return ctx
}

