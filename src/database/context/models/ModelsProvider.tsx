import { PropsWithChildren, createContext, useContext, useMemo } from "react"

import { DocumentModel, LogModel, PictureModel } from "../../models"
import { QuickSqliteProvider } from "../../providers"
import {
  DocumentQuickSqliteRepository,
  LogQuickSqliteRepository,
  PictureQuickSqliteRepository,
} from "../../repositories"
import { useQuickSqliteDatabases } from "../quick-sqlite"
import { ModelsType } from "./types"


const ModelsContext = createContext(null as unknown as ModelsType)


export function ModelsProvider(props: PropsWithChildren) {


  const { app, log } = useQuickSqliteDatabases()


  const models = useMemo<ModelsType>(() => {
    const logQuickSqliteProvider = new QuickSqliteProvider(log)
    const appQuickSqliteProvider = new QuickSqliteProvider(app)

    const logModel = new LogModel(
      new LogQuickSqliteRepository(logQuickSqliteProvider)
    )
    const documentModel = new DocumentModel(
      new DocumentQuickSqliteRepository(appQuickSqliteProvider)
    )
    const pictureModel = new PictureModel(
      new PictureQuickSqliteRepository(appQuickSqliteProvider)
    )

    return {
      logModel,
      documentModel,
      pictureModel,
    }
  }, [log, app])


  return (
    <ModelsContext.Provider value={models}>
      {props.children}
    </ModelsContext.Provider>
  )
}


export function useModels(): ModelsType {
  return useContext(ModelsContext)
}
