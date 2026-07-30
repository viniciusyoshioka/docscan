import type {
  DocumentRepository,
  LogRepository,
  PictureRepository,
} from '../repositories'


export interface Repositories {
  documentRepository: DocumentRepository
  pictureRepository: PictureRepository
  logRepository: LogRepository
}
