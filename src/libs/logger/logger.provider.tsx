import { PropsWithChildren, createContext, useCallback, useContext, useMemo } from "react"

import { useEntityModels } from "@database"
import { StandardDateFormatter } from "@libs/date-formatter"
import { Logger } from "./logger.interface"
import { ConsoleLogger, DatabaseLogger, MultipleLogger } from "./loggers"


const LoggerContext = createContext<Logger>({} as Logger)


export function LoggerProvider({ children }: PropsWithChildren) {


  const { logModel } = useEntityModels()


  const getLoggers = useCallback(() => {
    const loggers: Logger[] = []

    if (__DEV__) {
      const dateFormatter = new StandardDateFormatter()
      const consoleLogger = new ConsoleLogger(dateFormatter)
      loggers.push(consoleLogger)
    }

    const databaseLogger = new DatabaseLogger(logModel)
    loggers.push(databaseLogger)

    return loggers
  }, [])

  const logger = useMemo(() => {
    const loggers = getLoggers()
    return new MultipleLogger(...loggers)
  }, [getLoggers])


  return <LoggerContext.Provider value={logger} children={children} />
}


export function useLogger(): Logger {
  return useContext(LoggerContext)
}
