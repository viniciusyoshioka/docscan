import { open } from "react-native-quick-sqlite"

import { OpenDatabaseError } from "@database/errors"
import { DocumentSqliteSchema, PictureSqliteSchema } from "@database/schemas"
import { Constants } from "@services/constant"
import { stringifyError } from "@utils"


export function createAppDatabase() {
  try {
    const database = open({
      name: Constants.appDatabaseFileName,
      location: Constants.databaseFolder,
    })

    database.executeBatch([
      [DocumentSqliteSchema],
      [PictureSqliteSchema],
    ])

    return database
  } catch (error) {
    const message = stringifyError(error)
    throw new OpenDatabaseError(message)
  }
}
