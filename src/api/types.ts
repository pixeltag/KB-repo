export type KBFieldType = 'string' | 'number' | 'date' | 'boolean' | 'text'

export type KBField = {
  key: string
  label: string
  type: KBFieldType
  required?: boolean
  description?: string
}

export type KnowledgeBase = {
  id: string
  name: string
  slug: string
  description: string
  fields: KBField[]
  created_at: string
  updated_at: string
}

export type KnowledgeBaseCreate = {
  name: string
  description?: string
  fields?: KBField[]
}

export type KnowledgeBaseUpdate = {
  name?: string | null
  description?: string | null
  fields?: KBField[] | null
}

export type DocumentResponse = {
  id: string
  kb_id: string
  doc_id: string | null
  file_name: string
  uploaded_at: string
}

export type RecordResponse = {
  id: string
  kb_id: string
  doc_id: string | null
  file_name: string
  extracted_data: Record<string, unknown>
  uploaded_at: string
}

export type RecordUpdate = {
  extracted_data: Record<string, unknown>
}

export type ChatRequest = {
  query: string
  session_id?: string | null
}

export type ChatResponse = {
  session_id: string
  response: string
}

