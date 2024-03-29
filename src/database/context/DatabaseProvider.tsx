import { PropsWithChildren, createContext, useContext, useMemo } from "react"

import {
  DocumentRealmProvider,
  LogRealmProvider,
  useDocumentRealm,
  useLogRealm,
} from "../configs"
import { DocumentModel, DocumentPictureModel, LogModel } from "../models"
import { RealmDatabaseProvider } from "../providers"
import {
  RealmDocumentPictureRepository,
  RealmDocumentRepository,
  RealmLogRepository,
} from "../repositories"
import { DatabaseContextType } from "./types"


const DatabaseContext = createContext({} as DatabaseContextType)


export function DatabaseProvider(props: PropsWithChildren) {
  return (
    <LogRealmProvider>
      <DocumentRealmProvider>
        <DatabaseConsumer>
          {props.children}
        </DatabaseConsumer>
      </DocumentRealmProvider>
    </LogRealmProvider>
  )
}


function DatabaseConsumer(props: PropsWithChildren) {


  const logRealm = useLogRealm()
  const documentRealm = useDocumentRealm()


  const models: DatabaseContextType = useMemo(() => {
    const realmLogDatabaseProvider = new RealmDatabaseProvider(logRealm)
    const realmDocumentDatabaseProvider = new RealmDatabaseProvider(documentRealm)

    const realmLogRepository =
      new RealmLogRepository(realmLogDatabaseProvider)
    const realmDocumentRepository =
      new RealmDocumentRepository(realmDocumentDatabaseProvider)
    const realmDocumentPictureRepository =
      new RealmDocumentPictureRepository(realmDocumentDatabaseProvider)

    const logModel = new LogModel(realmLogRepository)
    const documentModel = new DocumentModel(realmDocumentRepository)
    const documentPictureModel = new DocumentPictureModel(realmDocumentPictureRepository)

    return {
      logModel,
      documentModel,
      documentPictureModel,
    }
  }, [logRealm, documentRealm])


  return (
    <DatabaseContext.Provider value={models}>
      {props.children}
    </DatabaseContext.Provider>
  )
}


export function useDatabase() {
  return useContext(DatabaseContext)
}