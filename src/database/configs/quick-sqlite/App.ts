import { open } from "react-native-quick-sqlite"

import { Constants } from "@services/constant"
import { stringifyError } from "@utils"
import { OpenDatabaseError } from "../../errors"
import { DocumentSqliteSchema, PictureSqliteSchema } from "../../schemas"


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
    throw new OpenDatabaseError("QuickSqlite", message)
  }
}
