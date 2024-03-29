import { IDocumentModel, IDocumentPictureModel, ILogModel } from "@database/models"


export type DatabaseContextType = {
  logModel: ILogModel
  documentModel: IDocumentModel
  documentPictureModel: IDocumentPictureModel
}
