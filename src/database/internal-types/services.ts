import type { DocumentService, LogService, PictureService } from '../services'


export interface Services {
  documentService: DocumentService
  pictureService: PictureService
  logService: LogService
}
