import { Repository } from "typeorm"

import { DocumentEntity } from "./document.entity"


export interface DocumentRepository {}


type CustomDocumentRepository = ThisType<Repository<DocumentEntity>> & DocumentRepository


export const customDocumentRepository: CustomDocumentRepository = {}
