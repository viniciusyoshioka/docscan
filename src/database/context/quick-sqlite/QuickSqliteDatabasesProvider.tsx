import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react"
import { Alert } from "react-native"

import { translate } from "@locales"
import { createAppDatabase, createLogDatabase } from "../../configs"
import { BaseDatabaseError, OpenDatabaseError } from "../../errors"
import { QuickSqliteDatabases } from "./types"


const QuickSqliteDatabasesContext = createContext(null as unknown as QuickSqliteDatabases)


export function QuickSqliteDatabasesProvider(props: PropsWithChildren) {


  const [errorInstance, setErrorInstance] = useState<BaseDatabaseError>()


  const databases = useMemo<QuickSqliteDatabases | null>(() => {
    try {
      const app = createAppDatabase()
      const log = createLogDatabase()
      return { app, log }
    } catch (error) {
      setErrorInstance(error as BaseDatabaseError)
      return null
    }
  }, [])


  if (databases === null) {
    if (errorInstance instanceof OpenDatabaseError) {
      console.error(errorInstance)
      Alert.alert(
        translate("criticalError"),
        translate("database_errorOpening_text"),
      )
    }
    return null
  }


  return (
    <QuickSqliteDatabasesContext.Provider value={databases}>
      {props.children}
    </QuickSqliteDatabasesContext.Provider>
  )
}


export function useQuickSqliteDatabases(): QuickSqliteDatabases {
  return useContext(QuickSqliteDatabasesContext)
}
