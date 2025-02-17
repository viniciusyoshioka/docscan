import { typeORMDriver } from "react-native-nitro-sqlite"
import { DataSource } from "typeorm"

import { Constants } from "@services/constant"
import { DocumentEntity } from "./entities/document/document.entity"
import { LogEntity } from "./entities/log/log.entity"
import { PictureEntity } from "./entities/picture/picture.entity"


export const appDataSource = new DataSource({
  type: "react-native",
  database: Constants.appDatabaseFileName,
  location: Constants.databaseFolder,
  driver: typeORMDriver,
  entities: [
    DocumentEntity,
    PictureEntity,
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
})


// TODO: Add data sources for imported and exported databases
