import { createRealmContext } from "@realm/react"

import { logRealmDatabaseFullPath } from "../../services/constant"
import { LogSchema } from "../schemas"


const LogRealmContext = createRealmContext({
    schema: [LogSchema],
    schemaVersion: 1,
    path: logRealmDatabaseFullPath,
    deleteRealmIfMigrationNeeded: __DEV__,
})

export const {
    RealmProvider: LogRealmProvider,
    useRealm: useLogRealm,
    useObject: useLogObject,
    useQuery: useLogQuery,
} = LogRealmContext
