import { typeORMDriver } from "react-native-nitro-sqlite"
import { DataSource } from "typeorm"

import { Constants } from "@services/constant"
import { DocumentEntity } from "./entities/document/document.entity"
import { LogEntity } from "./entities/log/log.entity"
import { PictureEntity } from "./entities/picture/picture.entity"

import { CreateAppTables1739999449769 } from "./migrations/app/1739999449769-CreateAppTables"
import { CreateLogTable1739999468414 } from "./migrations/log/1739999468414-CreateLogTable"


export const appDataSource = new DataSource({
  type: "react-native",
  database: Constants.appDatabaseFileName,
  location: Constants.databaseFolder,
  driver: typeORMDriver,
  entities: [
    DocumentEntity,
    PictureEntity,
  ],
  migrations: [
    CreateAppTables1739999449769,
  ],
})


export const logDataSource = new DataSource({
  type: "react-native",
  database: Constants.logDatabaseFileName,
  location: Constants.databaseFolder,
  driver: typeORMDriver,
  entities: [
    LogEntity,
  ],
  migrations: [
    CreateLogTable1739999468414,
  ],
})


// TODO: Add data sources for imported and exported databases
// TODO: Fix migration glob pattern to avoid importing every migration file
