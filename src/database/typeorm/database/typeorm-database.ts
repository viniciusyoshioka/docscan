import type { DataSource } from 'typeorm'

import { normalizeError } from '@utils'
import type { DatabaseErrors } from '../../database'
import { Database, DatabaseName } from '../../database'
import {
  BaseDatabaseError,
  CloseDatabaseError,
  DatabaseInitializationError,
  DatabaseMigrationError,
  DatabaseNotInitializedError,
} from '../../errors'
import type { Repositories } from '../../internal-types'
import {
  TypeOrmDocumentEntity,
  TypeOrmLogEntity,
  TypeOrmPictureEntity,
} from '../entities'
import {
  TypeOrmDocumentRepository,
  TypeOrmLogRepository,
  TypeOrmPictureRepository,
} from '../repositories'


export class TypeOrmDatabase extends Database<DataSource> {


  override async initialize(): Promise<DatabaseErrors> {
    const errors = this.buildEmptyDatabaseErrors()

    for (const databaseName of this.databaseNames) {
      const dataSource = this.databases[databaseName]

      if (dataSource.isInitialized) {
        continue
      }

      try {
        await dataSource.initialize()
      } catch (error) {
        if (error instanceof BaseDatabaseError) {
          errors[databaseName] = error
          continue
        }

        const errorInstance = normalizeError(error)

        const initializationError = new DatabaseInitializationError(
          errorInstance.message,
          errorInstance.stack,
        )

        errors[databaseName] = initializationError
      }
    }

    return errors
  }


  override async migrate(): Promise<DatabaseErrors> {
    const errors = this.buildEmptyDatabaseErrors()

    for (const databaseName of this.databaseNames) {
      const dataSource = this.databases[databaseName]

      try {
        if (!dataSource.isInitialized) {
          throw new DatabaseNotInitializedError(
            `Cannot run migrations on non initialized database "${databaseName}"`,
          )
        }

        await dataSource.runMigrations()
      } catch (error) {
        if (error instanceof BaseDatabaseError) {
          errors[databaseName] = error
          continue
        }

        const errorInstance = normalizeError(error)

        const migrationError = new DatabaseMigrationError(
          errorInstance.message,
          errorInstance.stack,
        )

        errors[databaseName] = migrationError
      }
    }

    return errors
  }


  override async close(): Promise<DatabaseErrors> {
    const errors = this.buildEmptyDatabaseErrors()

    for (const databaseName of this.databaseNames) {
      const dataSource = this.databases[databaseName]

      if (!dataSource.isInitialized) {
        continue
      }

      try {
        await dataSource.destroy()
      } catch (error) {
        if (error instanceof BaseDatabaseError) {
          errors[databaseName] = error
          continue
        }

        const errorInstance = normalizeError(error)

        const migrationError = new CloseDatabaseError(
          errorInstance.message,
          errorInstance.stack,
        )

        errors[databaseName] = migrationError
      }
    }

    return errors
  }


  override getRepositories(): Repositories {
    const appDatabase = this.databases[DatabaseName.APP]
    const logDatabase = this.databases[DatabaseName.LOG]


    const documentRepository = new TypeOrmDocumentRepository(
      TypeOrmDocumentEntity,
      appDatabase.manager,
    )
    const pictureRepository = new TypeOrmPictureRepository(
      TypeOrmPictureEntity,
      appDatabase.manager,
    )
    const logRepository = new TypeOrmLogRepository(
      TypeOrmLogEntity,
      logDatabase.manager,
    )


    return {
      documentRepository,
      pictureRepository,
      logRepository,
    }
  }
}
