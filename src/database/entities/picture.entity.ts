import type { Brand } from '../internal-types'
import type { DocumentId } from './document.entity.ts'


export type PictureId = Brand<number, 'pictureId'>


export interface PictureEntity {
  id: PictureId
  documentId: DocumentId
  fileName: string
  position: number
}
