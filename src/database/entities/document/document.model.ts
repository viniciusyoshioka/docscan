import { DocumentRepository } from "./document.repository"


export class DocumentModel {
  constructor(private readonly documentRepository: DocumentRepository) {}
}
