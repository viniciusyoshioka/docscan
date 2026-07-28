import { typeORMDriver } from 'react-native-nitro-sqlite'
import { DataSource } from 'typeorm'

import { Info } from '@modules/info'
import { DatabaseName } from '../../database'
import { TypeOrmLogEntity } from '../entities'
import { LOG_MIGRATIONS } from '../migrations'


export const LogDataSource = new DataSource({
  type: 'react-native',
  database: Info.database[DatabaseName.LOG].fileName,
  location: 'default',
  driver: typeORMDriver,
  entities: [
    TypeOrmLogEntity,
  ],
  migrations: LOG_MIGRATIONS,
  synchronize: false,
  migrationsRun: false,
})
