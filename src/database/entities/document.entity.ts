import type { Brand } from '@types'


export type DocumentId = Brand<number, 'documentId'>


export interface DocumentEntity {
  id: DocumentId
  title: string
  createdAt: number
  updatedAt: number
}
