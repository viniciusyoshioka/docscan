import { typeORMDriver } from 'react-native-nitro-sqlite'
import { DataSource } from 'typeorm'

import { Info } from '@modules/info'
import { DatabaseName } from '../../database'
import { APP_MIGRATIONS } from '../migrations'


export const AppDataSource = new DataSource({
  type: 'react-native',
  database: Info.database[DatabaseName.APP].fileName,
  location: 'default',
  driver: typeORMDriver,
  entities: [],
  migrations: APP_MIGRATIONS,
  synchronize: false,
  migrationsRun: false,
})
