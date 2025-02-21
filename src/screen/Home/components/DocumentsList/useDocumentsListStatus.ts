import { DocumentDTO } from "@database"


export type DocumentsListStatus = "isLoading" | "hasError" | "isEmpty" | "hasData" | "isLoadingMore"


interface DocumentsListStatusProps {
  data: DocumentDTO[]
  isLoading: boolean
  error?: Error
}


export function useDocumentsListStatus(props: DocumentsListStatusProps): DocumentsListStatus {


  const hasData = props.data.length > 0

  if (props.isLoading) {
    return hasData ? "isLoadingMore" : "isLoading"
  }
  if (!hasData) {
    return "isEmpty"
  }
  return "hasData"
}
