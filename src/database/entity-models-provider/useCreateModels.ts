import { useCallback } from "react"

import { appDataSource, logDataSource } from "../data-sources"
import { DocumentEntity } from "../entities/document/document.entity"
import { DocumentModel } from "../entities/document/document.model"
import {
  customDocumentRepository,
  DocumentRepository,
} from "../entities/document/document.repository"
import { LogEntity } from "../entities/log/log.entity"
import { LogModel } from "../entities/log/log.model"
import { customLogRepository, LogRepository } from "../entities/log/log.repository"
import { PictureEntity } from "../entities/picture/picture.entity"
import { PictureModel } from "../entities/picture/picture.model"
import {
  customPictureRepository,
  PictureRepository,
} from "../entities/picture/picture.repository"


type EntityRepositories = {
  documentRepository: DocumentRepository
  pictureRepository: PictureRepository
  logRepository: LogRepository
}

export type EntityModels = {
  documentModel: DocumentModel
  pictureModel: PictureModel
  logModel: LogModel
}


export function useCreateModels() {


  const createRepositories = useCallback((): EntityRepositories => {
    const documentRepository = appDataSource
      .getRepository(DocumentEntity)
      .extend(customDocumentRepository)
    const pictureRepository = appDataSource
      .getRepository(PictureEntity)
      .extend(customPictureRepository)

    const logRepository = logDataSource
      .getRepository(LogEntity)
      .extend(customLogRepository)

    return { documentRepository, pictureRepository, logRepository }
  }, [])


  const createModels = useCallback((repositories: EntityRepositories): EntityModels => {
    const { documentRepository, pictureRepository, logRepository } = repositories

    const documentModel = new DocumentModel(documentRepository)
    const pictureModel = new PictureModel(pictureRepository)
    const logModel = new LogModel(logRepository)

    return { documentModel, pictureModel, logModel }
  }, [])


  return {
    createRepositories,
    createModels,
  }
}
