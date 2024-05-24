import { PropsWithChildren } from "react"

import { ModelsProvider } from "./models"
import { QuickSqliteDatabasesProvider } from "./quick-sqlite"


export function DatabaseProvider(props: PropsWithChildren) {
  return (
    <QuickSqliteDatabasesProvider>
      <ModelsProvider>
        {props.children}
      </ModelsProvider>
    </QuickSqliteDatabasesProvider>
  )
}
