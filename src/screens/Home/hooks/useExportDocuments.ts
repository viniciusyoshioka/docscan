import { useCallback } from 'react'


type ExportDocuments = () => void


// TODO: Implement
export function useExportDocuments(): ExportDocuments {


  const exportDocuments = useCallback<ExportDocuments>(() => {

  }, [])


  return exportDocuments
}
