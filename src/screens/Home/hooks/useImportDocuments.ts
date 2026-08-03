import { useCallback } from 'react'


type ImportDocuments = () => void


// TODO: Implement
export function useImportDocuments(): ImportDocuments {


  const importDocuments = useCallback<ImportDocuments>(() => {

  }, [])


  return importDocuments
}
