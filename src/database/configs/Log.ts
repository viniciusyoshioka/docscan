import { createRealmContext } from "@realm/react"

import { Constants } from "@services/constant"
import { LogRealmSchema } from "../schemas"


const LogRealmContext = createRealmContext({
  schema: [LogRealmSchema],
  schemaVersion: 1,
  path: Constants.logDatabaseFullPath,
  deleteRealmIfMigrationNeeded: __DEV__,
})

export const {
  RealmProvider: LogRealmProvider,
  useRealm: useLogRealm,
  useObject: useLogObject,
  useQuery: useLogQuery,
} = LogRealmContext
