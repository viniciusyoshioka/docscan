import { typeORMDriver } from 'react-native-nitro-sqlite'
import { DataSource } from 'typeorm'

import { APP_MIGRATIONS } from '../migrations'


export const AppDataSource = new DataSource({
  type: 'react-native',
  database: 'app-database.sqlite',
  location: 'default',
  driver: typeORMDriver,
  entities: [],
  migrations: APP_MIGRATIONS,
  synchronize: false,
  migrationsRun: false,
})
