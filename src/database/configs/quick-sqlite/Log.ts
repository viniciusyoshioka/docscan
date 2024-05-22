import { open } from "react-native-quick-sqlite"

import { Constants } from "@services/constant"
import { stringifyError } from "@utils"
import { OpenDatabaseError } from "../../errors"
import { LogSqliteSchema } from "../../schemas"


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
