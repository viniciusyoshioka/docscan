import { open } from "react-native-quick-sqlite"

import { OpenDatabaseError } from "@database/errors"
import { LogSqliteSchema } from "@database/schemas"
import { Constants } from "@services/constant"
import { stringifyError } from "@utils"


export function createLogDatabase() {
  try {
    const database = open({
      name: Constants.logDatabaseFileName,
      location: Constants.databaseFolder,
    })

    database.execute(LogSqliteSchema)

    return database
  } catch (error) {
    const message = stringifyError(error)
    throw new OpenDatabaseError(message)
  }
}
