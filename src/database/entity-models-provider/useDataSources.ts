import { useCallback } from "react"

import { normalizeError } from "@utils"
import { appDataSource, logDataSource } from "../data-sources"


type DataSourceStatus =
  | {
    success: true
  }
  | {
    database: "app" | "log"
    success: false
    error: Error
  }


export function useDataSources() {


  const initializeDataSources = useCallback(async (): Promise<DataSourceStatus> => {
    try {
      if (!appDataSource.isInitialized) {
        await appDataSource.initialize()
      }
    } catch (error) {
      return {
        database: "app",
        success: false,
        error: normalizeError(error),
      }
    }

    try {
      if (!logDataSource.isInitialized) {
        await logDataSource.initialize()
      }
    } catch (error) {
      return {
        database: "log",
        success: false,
        error: normalizeError(error),
      }
    }

    return { success: true }
  }, [])


  const migrateDatabases = useCallback(async (): Promise<DataSourceStatus> => {
    try {
      if (!appDataSource.isInitialized) {
        throw new Error("App data source is not initialized")
      }

      await appDataSource.runMigrations()
    } catch (error) {
      return {
        database: "app",
        success: false,
        error: normalizeError(error),
      }
    }

    try {
      if (!logDataSource.isInitialized) {
        throw new Error("Log data source is not initialized")
      }

      await logDataSource.runMigrations()
    } catch (error) {
      return {
        database: "log",
        success: false,
        error: normalizeError(error),
      }
    }

    return { success: true }
  }, [])


  const closeDataSources = useCallback(async (): Promise<DataSourceStatus> => {
    try {
      if (appDataSource.isInitialized) {
        await appDataSource.destroy()
      }
    } catch (error) {
      return {
        database: "app",
        success: false,
        error: normalizeError(error),
      }
    }

    try {
      if (logDataSource.isInitialized) {
        await logDataSource.destroy()
      }
    } catch (error) {
      return {
        database: "log",
        success: false,
        error: normalizeError(error),
      }
    }

    return { success: true }
  }, [])


  return {
    initializeDataSources,
    migrateDatabases,
    closeDataSources,
  }
}
