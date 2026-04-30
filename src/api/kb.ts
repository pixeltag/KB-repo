import { apiRequest } from './client'
import type {
  ChatRequest,
  ChatResponse,
  DocumentResponse,
  KnowledgeBase,
  KnowledgeBaseCreate,
  KnowledgeBaseUpdate,
  RecordResponse,
  RecordUpdate,
} from './types'

const V1 = '/api/v1'

export const kbApi = {
  listKnowledgeBases: () => apiRequest<KnowledgeBase[]>(`${V1}/knowledge-bases`),
  createKnowledgeBase: (body: KnowledgeBaseCreate) =>
    apiRequest<KnowledgeBase>(`${V1}/knowledge-bases`, { method: 'POST', body }),
  getKnowledgeBase: (kbId: string) => apiRequest<KnowledgeBase>(`${V1}/knowledge-bases/${kbId}`),
  updateKnowledgeBase: (kbId: string, body: KnowledgeBaseUpdate) =>
    apiRequest<KnowledgeBase>(`${V1}/knowledge-bases/${kbId}`, { method: 'PUT', body }),
  deleteKnowledgeBase: (kbId: string) =>
    apiRequest<void>(`${V1}/knowledge-bases/${kbId}`, { method: 'DELETE' }),

  listDocuments: (kbId: string) => apiRequest<DocumentResponse[]>(`${V1}/knowledge-bases/${kbId}/documents`),
  uploadDocument: (kbId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiRequest<DocumentResponse>(`${V1}/knowledge-bases/${kbId}/documents`, {
      method: 'POST',
      body: form,
    })
  },

  listRecords: (kbId: string) => apiRequest<RecordResponse[]>(`${V1}/knowledge-bases/${kbId}/records`),
  getRecord: (kbId: string, recordId: string) =>
    apiRequest<RecordResponse>(`${V1}/knowledge-bases/${kbId}/records/${recordId}`),
  updateRecord: (kbId: string, recordId: string, body: RecordUpdate) =>
    apiRequest<RecordResponse>(`${V1}/knowledge-bases/${kbId}/records/${recordId}`, { method: 'PUT', body }),
  deleteRecord: (kbId: string, recordId: string) =>
    apiRequest<void>(`${V1}/knowledge-bases/${kbId}/records/${recordId}`, { method: 'DELETE' }),

  chat: (kbId: string, body: ChatRequest) =>
    apiRequest<ChatResponse>(`${V1}/knowledge-bases/${kbId}/chat`, { method: 'POST', body }),
}

