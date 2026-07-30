import { typeORMDriver } from 'react-native-nitro-sqlite'
import { DataSource } from 'typeorm'

import { Info } from '@modules/info'
import { TypeOrmDocumentEntity, TypeOrmPictureEntity } from '../entities'
import { APP_MIGRATIONS } from '../migrations'


export const AppDataSource = new DataSource({
  type: 'react-native',
  database: Info.databases.app.fileName,
  location: Info.databases.app.relativePath,
  driver: typeORMDriver,
  entities: [
    TypeOrmDocumentEntity,
    TypeOrmPictureEntity,
  ],
  migrations: APP_MIGRATIONS,
  synchronize: false,
  migrationsRun: false,
})
