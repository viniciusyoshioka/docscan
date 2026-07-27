import type { BaseDatabaseError } from '../errors'
import type { Repositories } from '../internal-types'


export enum DatabaseName {
  APP = 'APP',
  LOG = 'LOG',
}


export type Databases<T> = {
  [K in DatabaseName]: T
}


export type DatabaseErrors = {
  [K in DatabaseName]: BaseDatabaseError | null
}


export abstract class Database<T> {


  protected readonly databases: Databases<T>


  constructor(databases: Databases<T>) {
    this.databases = databases
  }


  abstract initialize(): Promise<DatabaseErrors>

  abstract migrate(): Promise<DatabaseErrors>

  abstract close(): Promise<DatabaseErrors>

  abstract getRepositories(): Repositories


  protected get databaseNames(): DatabaseName[] {
    return Object.keys(this.databases) as DatabaseName[]
  }

  protected buildEmptyDatabaseErrors(): DatabaseErrors {
    const databaseErrors: DatabaseErrors = {
      [DatabaseName.APP]: null,
      [DatabaseName.LOG]: null,
    }

    return databaseErrors
  }
}
